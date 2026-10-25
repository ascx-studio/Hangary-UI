import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { prepareShader } from "@vgpu/wgsl/prepare";
import { effect, init, target } from "vgpu/node";

const source = prepareShader(await readFile(new URL("../registry/shader/chroma-background.wgsl", import.meta.url), "utf8"));
const gpu = await init();
try {
  const width = 384;
  const height = 256;
  const output = target(gpu, { size: [width, height], format: "rgba8unorm" });
  const shader = effect(gpu, source, { set: { cfg: {
    metrics: [width, height, 0, 0.9], pointer: [0.5, 0.5, 0, 0], settings: [0, 0.035, 0, 0],
  } } });
  await shader.compile(output);
  const render = async (time: number, intensity = 0.9) => {
    shader.set({ cfg: { metrics: [width, height, time, intensity] } });
    shader.draw(output);
    return new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" }));
  };
  const first = await render(0);
  assert.ok(first.some((value, i) => i % 4 !== 3 && value > 80), "Color ribbons must be visible");
  assert.ok(first.some((value, i) => i % 4 !== 3 && value < 15), "Background must retain dark areas");
  for (let i = 3; i < first.length; i += 4) assert.equal(first[i], 255);
  assert.notDeepEqual(await render(2), first, "Time must move the color field");
  assert.deepEqual(await render(0), first, "Still frames must be deterministic");
  const energy = (pixels: Uint8Array) => pixels.reduce((sum, value, i) => sum + (i % 4 === 3 ? 0 : value), 0);
  assert.ok(energy(await render(0, 0.2)) < energy(first), "Intensity must control brightness");
  shader.set({ cfg: { pointer: [0.65, 0.5, 1, 0] } });
  assert.notDeepEqual(await render(0), first, "Pointer must bend the color field");
  shader.set({ cfg: { pointer: [0.5, 0.5, 0, 0], settings: [Math.PI, 0.035, 0, 0] } });
  assert.notDeepEqual(await render(0), first, "Hue offset must change the palette");
  if (process.argv.includes("--preview")) {
    await writeFile("/tmp/hangry-chroma.ppm", Buffer.concat([Buffer.from(`P6\n${width} ${height}\n255\n`), first.filter((_, i) => i % 4 !== 3)]));
  }
  console.log("Chroma color, motion, brightness, pointer, hue, and deterministic frames passed");
} finally {
  gpu.dispose();
}
