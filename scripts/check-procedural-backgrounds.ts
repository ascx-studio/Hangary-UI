import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { prepareShader } from "@vgpu/wgsl/prepare";
import { effect, init, target } from "vgpu/node";

const variants = { chroma: [0, 0.035], "light-tunnel": [5, 0], ascii: [14, 0], heatmap: [1.5, 0], "liquid-chrome": [1.6, 0.8, 0.3, 1] };
const gpu = await init();
try {
  const width = 384;
  const height = 256;
  const output = target(gpu, { size: [width, height], format: "rgba8unorm" });
  for (const [name, settings] of Object.entries(variants)) {
    const source = prepareShader(await readFile(new URL(`../registry/shader/${name}-background.wgsl`, import.meta.url), "utf8"));
    const shader = effect(gpu, source, { set: { cfg: {
      metrics: [width, height, 0, 0.9], pointer: [0.5, 0.5, 0, 0], settings: [settings[0], settings[1], settings[2] ?? 0, settings[3] ?? 0],
    } } });
    await shader.compile(output);
    const render = async (time: number, intensity = 0.9, hover = 0) => {
      shader.set({ cfg: { metrics: [width, height, time, intensity], pointer: [0.65, 0.45, hover, 0] } });
      shader.draw(output);
      return new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" }));
    };
    const first = await render(0);
    assert.ok(first.some((value, i) => i % 4 !== 3 && value > 60), `${name}: effect must be visible`);
    for (let i = 3; i < first.length; i += 4) assert.equal(first[i], 255);
    assert.notDeepEqual(await render(2), first, `${name}: time must animate the effect`);
    assert.deepEqual(await render(0), first, `${name}: still frames must be deterministic`);
    const energy = (pixels: Uint8Array) => pixels.reduce((sum, value, i) => sum + (i % 4 === 3 ? 0 : value), 0);
    assert.ok(energy(await render(0, 0.2)) < energy(first), `${name}: intensity must control brightness`);
    assert.notDeepEqual(await render(0, 0.9, 1), first, `${name}: pointer must affect the field`);
    if (name === "liquid-chrome") {
      shader.set({ cfg: { settings: [1.6, 0.8, 1, 1] } });
      assert.notDeepEqual(await render(0), first, "Liquid Chrome roughness must soften reflections");
      shader.set({ cfg: { settings: [1.6, 0.8, 0.3, 0.3] } });
      assert.ok(energy(await render(0)) < energy(first), "Liquid Chrome exposure must control reflected light");
    }
    if (process.argv.includes("--preview")) {
      await writeFile(`/tmp/hangry-${name}.ppm`, Buffer.concat([Buffer.from(`P6\n${width} ${height}\n255\n`), first.filter((_, i) => i % 4 !== 3)]));
    }
    shader.dispose();
  }
  console.log("Chroma, Light Tunnel, ASCII, Heatmap, and Liquid Chrome GPU render checks passed");
} finally {
  gpu.dispose();
}
