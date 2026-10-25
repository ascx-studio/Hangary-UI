import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { prepareShader } from "@vgpu/wgsl/prepare";
import { effect, init, target } from "vgpu/node";

const source = prepareShader(await readFile(new URL("../registry/shader/topographic-contour-map.wgsl", import.meta.url), "utf8"));
const gpu = await init();
try {
  const width = 384;
  const height = 256;
  const output = target(gpu, { size: [width, height], format: "rgba8unorm" });
  const shader = effect(gpu, source, {
    set: { cfg: { metrics: [width, height, 3, 0], contours: [24, 1, 0, 0], pointer: [0.5, 0.5, 0, 0], options: [1, 1, 0, 0], low: [1, 0.549, 0.314, 1], foreground: [1, 0.745, 0.471, 1], high: [1, 0.902, 0.706, 1], background: [0.012, 0.012, 0.012, 1] } },
  });
  await shader.compile(output);
  const render = async (time: number, lineWidth = 1, density = 24) => {
    shader.set({ cfg: { metrics: [width, height, 3, time], contours: [density, lineWidth, 0, 0] } });
    shader.draw(output);
    return new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" }));
  };
  const first = await render(0);
  const greens = Array.from({ length: width * height }, (_, i) => first[i * 4 + 1]);
  assert.ok(Math.max(...greens) - Math.min(...greens) > 80, "Contours must contrast with the background");
  assert.ok(greens.some(value => value < 20), "Terrain must leave space between contours");
  for (let i = 3; i < first.length; i += 4) assert.equal(first[i], 255);
  assert.notDeepEqual(await render(2), first, "Time must move the terrain");
  assert.deepEqual(await render(0), first, "The same time must reproduce the same contours");
  assert.notDeepEqual(await render(0, 1, 12), first, "Density must change contour spacing");
  const thick = await render(0, 3);
  assert.ok(thick.reduce((sum, value, i) => sum + (i % 4 === 1 ? value : 0), 0) > greens.reduce((sum, value) => sum + value, 0), "Wider contours must cover more area");
  shader.set({ cfg: { pointer: [0.65, 0.5, 1, 0] } });
  const raised = await render(0);
  assert.notDeepEqual(raised, first, "Hover must raise the terrain");
  shader.set({ cfg: { pointer: [0.65, 0.5, 1, 1] } });
  assert.notDeepEqual(await render(0), raised, "Press must depress the terrain");
  shader.set({ cfg: { pointer: [0.5, 0.5, 0, 0], options: [0, 1, 0, 0] } });
  assert.notDeepEqual(await render(0), first, "Labels must be independently switchable");
  if (process.argv.includes("--preview")) {
    const rgb = first.filter((_, i) => i % 4 !== 3);
    await writeFile("/tmp/hangry-topographic-contour-map.ppm", Buffer.concat([Buffer.from(`P6\n${width} ${height}\n255\n`), rgb]));
  }
  console.log("Topographic contours, spacing, line width, motion, and deterministic frames passed");
} finally {
  gpu.dispose();
}
