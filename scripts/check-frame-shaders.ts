import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolveShader } from "@vgpu/wgsl/runtime";
import { prepareShader } from "@vgpu/wgsl/prepare";
import { effect, init, target } from "vgpu/node";

const gpu = await init();
try {
  const width = 256;
  const height = 144;
  const output = target(gpu, { size: [width, height], format: "rgba8unorm" });
  for (const variant of ["led", "light-ray"] as const) {
    const entry = fileURLToPath(new URL(`../registry/shader/${variant}-background.wgsl`, import.meta.url));
    const source = prepareShader(await resolveShader({ entry, validate: "require" }), entry);
    const uniforms = (time: number, hover = 0, intensity = 1) => ({ cfg: {
      metrics: [width, height, time, intensity], pointer: [0.8, 0.3, hover, 0],
      ...(variant === "light-ray" ? { animation: [time * 0.3, -1.9, 0, 0] } : {}),
    } });
    const shader = effect(gpu, source, { set: uniforms(0) });
    await shader.compile(output);
    const render = async (time: number) => {
      shader.set(uniforms(time));
      shader.draw(output);
      return new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" }));
    };
    const first = await render(0);
    assert.ok(first.some((value, i) => i % 4 !== 3 && value > 45), `${variant} must have visible highlights`);
    assert.ok(first.some((value, i) => i % 4 !== 3 && value < 20), `${variant} must retain dark areas`);
    for (let i = 3; i < first.length; i += 4) assert.equal(first[i], 255);
    assert.notDeepEqual(await render(3), first, `${variant} must animate`);
    assert.deepEqual(await render(0), first, `${variant} must support a deterministic still frame`);
    shader.set(uniforms(0, 1));
    shader.draw(output);
    assert.notDeepEqual(new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" })), first, `${variant} must respond to hover`);
    shader.set(uniforms(0, 0, 0.25));
    shader.draw(output);
    const dim = new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" }));
    const energy = (pixels: Uint8Array) => pixels.reduce((sum, value, i) => sum + (i % 4 === 3 ? 0 : value), 0);
    assert.ok(energy(dim) < energy(first), `${variant} intensity must control background brightness`);
    if (variant === "light-ray") {
      shader.set({ cfg: { ...uniforms(0).cfg, animation: [0, -1.9, 0, 1] } });
      shader.draw(output);
      assert.notDeepEqual(new Uint8Array(await output.color.read({ mipLevel: 0, region: "all" })), first, "Click surge must change the strands");
      if (process.argv.includes("--preview")) {
        const rgb = first.filter((_, i) => i % 4 !== 3);
        await writeFile("/tmp/hangry-light-ray.ppm", Buffer.concat([Buffer.from(`P6\n${width} ${height}\n255\n`), rgb]));
      }
    }
    shader.dispose();
  }
  console.log("LED and Light Ray highlights, animation, opacity, hover, and still frames passed");
} finally {
  gpu.dispose();
}
