import assert from "node:assert/strict";
import { mock } from "bun:test";

// Exercise teardown races without needing a GPU or scheduling real animation frames.
let finishInit;
let finishCompile;
let loopTick;
let resize;
let pending;
let disposedGpu = 0;
let disposedShader = 0;
let disposedSurface = 0;
let stopped = 0;
let passes = 0;
let loops = 0;
const gpu = { dispose() { disposedGpu++; } };
const target = { size: [320, 180], dispose() { disposedSurface++; } };
mock.module("vgpu", () => ({
  init: () => new Promise(resolve => { finishInit = () => resolve(gpu); }),
  surface: () => target,
  effect: () => ({ set() {}, compile: () => new Promise(resolve => { finishCompile = resolve; }), dispose() { disposedShader++; } }),
  clock: () => ({ time: 4 }),
  frame: (_, draw) => draw({ pass() { passes++; } }),
  frameLoop: (_, draw) => { loops++; loopTick = draw; return { stop() { stopped++; } }; },
}));
globalThis.ResizeObserver = class { constructor(callback) { resize = callback; } observe() {} disconnect() { resize = undefined; } };
globalThis.requestAnimationFrame = callback => { pending = callback; return 1; };
globalThis.cancelAnimationFrame = () => { pending = undefined; };
const { createShaderRenderer } = await import("../registry/shader/shader-renderer.shared.ts");
const canvas = { style: {} };
const samples = [];
const options = { label: "test", uniforms: (time, size) => { samples.push([time, ...size]); return {}; } };
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

const early = createShaderRenderer(canvas, {}, options);
early.dispose();
finishInit();
await flush();
assert.equal(disposedGpu, 1, "A late init must release its GPU after unmount");
assert.equal(disposedSurface, 0, "An unmounted renderer must not allocate a surface");

const compiling = createShaderRenderer(canvas, {}, options);
finishInit();
await flush();
compiling.dispose();
finishCompile();
await flush();
assert.equal(loops, 0, "Late compilation must not start an unmounted loop");

const still = createShaderRenderer(canvas, {}, { ...options, animated: false });
finishInit();
await flush();
finishCompile();
await flush();
pending();
assert.deepEqual(samples.at(-1), [0, 320, 180]);
target.size = [640, 360];
resize();
pending();
assert.deepEqual(samples.at(-1), [0, 640, 360], "Static resize must redraw at time zero");
assert.equal(loops, 0);
still.dispose();
still.dispose();
assert.equal(resize, undefined);
assert.equal(pending, undefined);

const animated = createShaderRenderer(canvas, {}, options);
finishInit();
await flush();
finishCompile();
await flush();
loopTick({ pass() { passes++; } });
assert.deepEqual(samples.at(-1), [4, 640, 360]);
assert.equal(canvas.style.opacity, "1");
animated.dispose();
assert.equal(stopped, 1);
assert.equal(disposedGpu, 4);
assert.equal(disposedSurface, 3);
assert.equal(disposedShader, 3);
assert.equal(passes, 3);
console.log("Shader renderer: late init/compile, static resize, animation, and idempotent teardown passed");
