import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { resolveShader } from "@vgpu/wgsl/runtime";
import { prepareShader } from "@vgpu/wgsl/prepare";
import { effect, init, target } from "vgpu/node";

const source = prepareShader(await resolveShader({ entry: resolve("registry/shader/photon-corridor-background.wgsl") }));
const gpu = await init();
try {
  const output = target(gpu, { size: [400, 400], format: "rgba8unorm" });
  const shader = effect(gpu, source, { set: { cfg: { metrics: [400, 400, 0, 0.9], pointer: [0.5, 0.5, 0, 0], settings: [0, 0, 0, 0] } } });
  await shader.compile(output);
  const render = async (time = 0, intensity = 0.9, hover = 0) => {
    shader.set({ cfg: { metrics: [400, 400, time, intensity], pointer: [0.8, 0.3, hover, 0] } });
    shader.draw(output);
    return new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" }));
  };
  const first = await render();
  for (let i = 0; i < first.length; i += 4) { assert.equal(first[i], first[i + 1]); assert.equal(first[i], first[i + 2]); }
  // Independent line seeds must produce different highlights on opposing walls.
  let independentlyLit = 0;
  for (let y = 120; y < 280; y++) {
    for (let x = 5; x < 80; x++) {
      if (Math.abs(first[(y * 400 + x) * 4] - first[(y * 400 + 399 - x) * 4]) > 40) independentlyLit++;
    }
  }
  assert.ok(independentlyLit > 50, "Individual lines must glow independently, rather than as one synchronized wave");
  const energy = (pixels: Uint8Array) => pixels.reduce((sum, v, i) => sum + (i % 4 === 3 ? 0 : v), 0);
  assert.ok(first.some((v, i) => i % 4 !== 3 && v > 200), "Bright corridor lights must be visible");
  assert.deepEqual(await render(), first, "Still frames must be deterministic");
  assert.notDeepEqual(await render(0.37), first, "Time must animate the light cells");
  assert.notDeepEqual(await render(0, 0.9, 1), first, "Pointer must steer the corridor");
  assert.ok(energy(await render(0, 0.2)) < energy(first), "Intensity must control brightness");
  assert.equal(energy(await render(0, 0)), 0, "Zero intensity must produce black");
  for (let i = 3; i < first.length; i += 4) assert.equal(first[i], 255);
  if (process.argv.includes("--preview")) await writeFile("/tmp/photon-corridor.ppm", Buffer.concat([Buffer.from("P6\n400 400\n255\n"), first.filter((_, i) => i % 4 !== 3)]));
  shader.dispose();
  console.log("Photon Corridor: deterministic pixels, time, pointer, intensity, and opacity passed");
} finally { gpu.dispose(); }
