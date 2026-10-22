"use client";

import { memo, useEffect, useRef } from "react";
import { clock, effect, frame, frameLoop, init, surface } from "vgpu";
import wordmarkLedShader from "./wordmark-led.wgsl";

export const WordmarkLed = memo(function WordmarkLed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let gpu: Awaited<ReturnType<typeof init>> | undefined;
    let canvasSurface: ReturnType<typeof surface> | undefined;
    let shader: ReturnType<typeof effect> | undefined;
    let stop: ReturnType<typeof frameLoop> | undefined;
    let cleaned = false;
    let hovering = false;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let elapsed = 0;
    let reducedMotion = false;
    let mark: HTMLDivElement | null = null;
    let onPointerMove: ((event: PointerEvent) => void) | undefined;
    let onPointerLeave: (() => void) | undefined;

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      stop?.stop();
      if (mark && onPointerMove && onPointerLeave) {
        mark.removeEventListener("pointermove", onPointerMove);
        mark.removeEventListener("pointerleave", onPointerLeave);
      }
      shader?.dispose();
      canvasSurface?.dispose();
      gpu?.dispose();
    };

    const start = async () => {
      gpu = await init();
      if (disposed) {
        gpu.dispose();
        gpu = undefined;
        return;
      }

      canvasSurface = surface(gpu, canvas, { dpr: [1, 2] });
      shader = effect(gpu, wordmarkLedShader, {
        label: "wordmark-led",
        set: { params: { time: [0, 0, 0, 0] } },
      });
      await shader.compile(canvasSurface);
      if (disposed) return cleanup();

      const time = clock(gpu);
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const draw = () => {
        shader?.set({ params: { time: [elapsed, pointerX, pointerY, hovering ? 1 : 0] } });
        frame(gpu!, (currentFrame) => {
          if (shader && canvasSurface) currentFrame.pass(canvasSurface, shader);
        });
      };

      mark = markRef.current;
      onPointerMove = (event) => {
        const bounds = mark!.getBoundingClientRect();
        pointerX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        pointerY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        hovering = true;
        if (reducedMotion) draw();
      };
      onPointerLeave = () => {
        hovering = false;
        if (reducedMotion) draw();
      };
      mark?.addEventListener("pointermove", onPointerMove);
      mark?.addEventListener("pointerleave", onPointerLeave);

      if (reducedMotion) {
        draw();
      } else {
        stop = frameLoop(gpu, (currentFrame) => {
          elapsed = time.time;
          shader?.set({ params: { time: [elapsed, pointerX, pointerY, hovering ? 1 : 0] } });
          if (shader && canvasSurface) currentFrame.pass(canvasSurface, shader);
        });
      }
    };

    void start().catch((error: unknown) => {
      if (!disposed) console.error("Wordmark LED could not start:", error);
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
        className="aspect-[1337/336] w-[88%] mix-blend-screen"
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
