import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { prepareShader } from "@vgpu/wgsl/prepare";
import { effect, init, target } from "vgpu/node";

const source = prepareShader(await readFile(new URL("../registry/shader/dither-background.wgsl", import.meta.url), "utf8"));
const gpu = await init();
try {
  const output = target(gpu, { size: [64, 64], format: "rgba8unorm" });
  const shader = effect(gpu, source, {
    set: { cfg: { metrics: [64, 64, 2, 0], pointer: [0.5, 0.5, 0, 0], ripple: [0.5, 0.5, 0, 0], foreground: [1, 1, 1, 1], background: [0, 0, 0, 1] } },
  });
  await shader.compile(output);
  const render = async (time: number) => {
    shader.set({ cfg: { metrics: [64, 64, 2, time] } });
    shader.draw(output);
    return new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" }));
  };
  const first = await render(0);
  const colors = new Set<number>();
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const offset = (y * 64 + x) * 4;
      const value = first[offset];
      colors.add(value);
      assert.ok(value === 0 || value === 255, "Dither must use only the two configured colors");
      assert.equal(first[offset + 1], value);
      assert.equal(first[offset + 2], value);
      assert.equal(first[offset + 3], 255);
      const cellStart = (Math.floor(y / 2) * 2 * 64 + Math.floor(x / 2) * 2) * 4;
      assert.equal(value, first[cellStart], "Each 2x2 pixel cell must have one color");
    }
  }
  assert.equal(colors.size, 2, "Both colors must appear");
  assert.notDeepEqual(await render(2), first, "Time must move the waves");
  assert.deepEqual(await render(0), first, "The same time must reproduce the same frame");
  shader.set({ cfg: { pointer: [0.5, 0.5, 1, 0] } });
  const hovered = await render(0);
  assert.notDeepEqual(hovered, first, "Hover must change the dither pattern");
  const center = (32 * 64 + 32) * 4;
  assert.equal(hovered[center], 0, "Repulsion must clear space around the pointer");
  shader.set({ cfg: { pointer: [0.5, 0.5, 0, 0] } });
  assert.deepEqual(await render(0), first, "Leaving must restore the pattern");
  shader.set({ cfg: { ripple: [0.5, 0.5, 0.1, 1] } });
  assert.notDeepEqual(await render(0), first, "Click ripple must displace the pattern");
  shader.set({ cfg: { ripple: [0.5, 0.5, 0.8, 1] } });
  assert.deepEqual(await render(0), first, "Expired ripple must restore the pattern");
  console.log("Dither colors, pixel size, animation, repulsion, click ripple, and deterministic frames passed");
} finally {
  gpu.dispose();
}
