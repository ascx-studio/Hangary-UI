import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { resolveShader } from "@vgpu/wgsl/runtime";
import { prepareShader } from "@vgpu/wgsl/prepare";
import { effect, init, target } from "vgpu/node";

const source = prepareShader(await resolveShader({ entry: resolve("registry/shader/koi-pond-background.wgsl") }));
const gpu = await init();
try {
  const output = target(gpu, { size: [400, 400], format: "rgba8unorm" });
  const shader = effect(gpu, source, { set: { cfg: { metrics: [400, 400, 0, 0.9], pointer: [0.5, 0.5, 0, 0], settings: [0, 0, 0, 0] } } });
  await shader.compile(output);
  const render = async (time = 0, intensity = 0.9, hover = 0, splashAge = -1) => {
    shader.set({ cfg: { metrics: [400, 400, time, intensity], pointer: [0.8, 0.3, hover, 0], settings: [0.7, 0.4, Math.max(0, splashAge), splashAge >= 0 ? 1 : 0] } });
    shader.draw(output);
    return new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" }));
  };
  const first = await render();
  const waterPixels = first.filter((v, i) => i % 4 === 0 && first[i + 1] > v * 1.2 && first[i + 1] > first[i + 2] * 1.1).length;
  assert.ok(waterPixels > 60000, "Green pond water must cover most of the scene");
  const fishPixels = first.filter((v, i) => i % 4 === 0 && v > 65 && Math.abs(v - first[i + 1]) < 25).length;
  assert.ok(fishPixels > 500, "Silver fish must remain distinct from the water");
  const energy = (pixels: Uint8Array) => pixels.reduce((sum, v, i) => sum + (i % 4 === 3 ? 0 : v), 0);
  assert.ok(first.some((v, i) => i % 4 !== 3 && v > 100), "Ink koi must be visible");
  assert.deepEqual(await render(), first, "Still frames must be deterministic");
  assert.notDeepEqual(await render(0.37), first, "Time must animate the swimming koi");
  assert.notDeepEqual(await render(0, 0.9, 1), first, "Nearby koi must react to hover");
  assert.ok(energy(await render(0, 0.2)) < energy(first), "Intensity must control scene brightness");
  assert.equal(energy(await render(0, 0)), 0, "Zero intensity must produce black");
  const splash = await render(0, 0.9, 0, 0.5);
  assert.notDeepEqual(splash, first, "Click must create a visible ripple");
  assert.notDeepEqual(await render(0, 0.9, 0, 1), splash, "Click ripple must expand with its age");
  const difference = (pixels: Uint8Array) => pixels.reduce((sum, v, i) => sum + Math.abs(v - first[i]), 0);
  assert.ok(difference(await render(0, 0.9, 0, 10)) < difference(splash) * 0.05, "Click ripples must dissipate");
  for (let i = 3; i < first.length; i += 4) assert.equal(first[i], 255);
  if (process.argv.includes("--preview")) await writeFile("/tmp/koi-pond.ppm", Buffer.concat([Buffer.from("P6\n400 400\n255\n"), first.filter((_, i) => i % 4 !== 3)]));
  shader.dispose();
  console.log("Koi Pond: deterministic pixels, time, pointer, intensity, and opacity passed");
} finally { gpu.dispose(); }
