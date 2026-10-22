"use client";

import { memo, useEffect, useRef } from "react";
import { clock, draw, frame, frameLoop, geometry, init, storage, surface } from "vgpu";
import ledEmittersShader from "./wordmark-light-ray.wgsl";

const MARK_SIZE = [1337, 336] as const;
const LED_COLUMNS = 64;
const LED_ROWS = 16;
const LED_COUNT = LED_COLUMNS * LED_ROWS;
const LED_RADIUS = 4.5;

export const WordmarkLightRay = memo(function WordmarkLightRay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const mark = markRef.current;
    if (!canvas || !mark) return;

    let disposed = false;
    let gpu: Awaited<ReturnType<typeof init>> | undefined;
    let canvasSurface: ReturnType<typeof surface> | undefined;
    let ledGeometry: ReturnType<typeof geometry> | undefined;
    let ledStorage: ReturnType<typeof storage> | undefined;
    let ledDraw: ReturnType<typeof draw> | undefined;
    let stop: ReturnType<typeof frameLoop> | undefined;
    let cleaned = false;
    let pointerX = MARK_SIZE[0] * 0.5;
    let pointerY = MARK_SIZE[1] * 0.5;
    let hovering = false;
    let renderStatic: (() => void) | undefined;

    const onPointerMove = (event: PointerEvent) => {
      const bounds = mark.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width) * MARK_SIZE[0];
      pointerY = ((event.clientY - bounds.top) / bounds.height) * MARK_SIZE[1];
      hovering = true;
      renderStatic?.();
    };
    const onPointerLeave = () => {
      hovering = false;
      renderStatic?.();
    };

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      stop?.stop();
      mark.removeEventListener("pointermove", onPointerMove);
      mark.removeEventListener("pointerleave", onPointerLeave);
      ledDraw?.dispose();
      ledGeometry?.destroy();
      canvasSurface?.dispose();
      gpu?.dispose();
    };

    const start = async () => {
      gpu = await init();
      if (disposed) return cleanup();

      canvasSurface = surface(gpu, canvas, { size: MARK_SIZE });
      ledGeometry = geometry(gpu, { buffers: [{
        data: createEmitterVertices().buffer as ArrayBuffer,
        stride: 12,
        attributes: { position: "float32x2", led_index: "float32" },
      }] });
      ledStorage = storage(gpu, LED_COUNT * 8 * Float32Array.BYTES_PER_ELEMENT);
      ledStorage.write(createEmitterState().buffer as ArrayBuffer);
      ledDraw = draw(gpu, {
        shader: ledEmittersShader,
        label: "wordmark-light-ray-emitters",
        geometry: ledGeometry,
        set: {
          cfg: {
            resolution: MARK_SIZE,
            tunables: [1, 0.12, 1, 0],
            ray: [pointerX, pointerY, 0, 0],
          },
          leds: ledStorage,
        },
      });
      await ledDraw.compile(canvasSurface);
      if (disposed) return cleanup();

      mark.addEventListener("pointermove", onPointerMove);
      mark.addEventListener("pointerleave", onPointerLeave);
      const time = clock(gpu);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        renderStatic = () => {
          ledDraw?.set({ cfg: { ray: [pointerX, pointerY, 0, hovering ? 1 : 0] } });
          if (gpu && canvasSurface && ledDraw) {
            frame(gpu, (currentFrame) => currentFrame.pass(canvasSurface!, ledDraw!));
          }
        };
        renderStatic();
      } else {
        stop = frameLoop(gpu, (currentFrame) => {
          ledDraw?.set({ cfg: { ray: [pointerX, pointerY, time.time, hovering ? 1 : 0] } });
          if (canvasSurface && ledDraw) currentFrame.pass(canvasSurface, ledDraw);
        });
      }
    };

    void start().catch((error: unknown) => {
      if (!disposed) console.error("Wordmark Light Ray could not start:", error);
      cleanup();
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
      <div
        ref={markRef}
        className="aspect-[1337/336] w-[88%]"
        style={{
          maskImage: "url('/wordmark.svg')",
          maskPosition: "center",
          maskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskImage: "url('/wordmark.svg')",
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
        }}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
      </div>
    </div>
  );
});

function createEmitterVertices() {
  const vertices = new Float32Array(LED_COUNT * 6 * 3);
  let offset = 0;
  const pushVertex = (ledIndex: number, x: number, y: number) => {
    vertices[offset++] = x;
    vertices[offset++] = y;
    vertices[offset++] = ledIndex;
  };

  for (let row = 0; row < LED_ROWS; row += 1) {
    for (let column = 0; column < LED_COLUMNS; column += 1) {
      const index = row * LED_COLUMNS + column;
      const centerX = ((column + 0.5) / LED_COLUMNS) * MARK_SIZE[0];
      const centerY = ((row + 0.5) / LED_ROWS) * MARK_SIZE[1];
      const left = centerX - LED_RADIUS;
      const right = centerX + LED_RADIUS;
      const top = centerY - LED_RADIUS;
      const bottom = centerY + LED_RADIUS;
      pushVertex(index, left, top);
      pushVertex(index, right, top);
      pushVertex(index, right, bottom);
      pushVertex(index, left, top);
      pushVertex(index, right, bottom);
      pushVertex(index, left, bottom);
    }
  }

  return vertices;
}

function createEmitterState() {
  const state = new Float32Array(LED_COUNT * 8);
  for (let row = 0; row < LED_ROWS; row += 1) {
    for (let column = 0; column < LED_COLUMNS; column += 1) {
      const index = row * LED_COLUMNS + column;
      const offset = index * 8;
      state[offset] = ((column + 0.5) / LED_COLUMNS) * MARK_SIZE[0];
      state[offset + 1] = ((row + 0.5) / LED_ROWS) * MARK_SIZE[1];
      state[offset + 2] = 0.72 + ((index * 37) % 29) / 100;
      state[offset + 4] = 0.82;
      state[offset + 5] = 0.93;
      state[offset + 6] = 1;
      state[offset + 7] = 1;
    }
  }
  return state;
}
