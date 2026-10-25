"use client";

import { memo, useEffect, useRef } from "react";
import { clock, effect, frame, frameLoop, init, surface } from "vgpu";
import lightRayShader from "./wordmark-light-ray.wgsl";

const MARK_SIZE = [1337, 336] as const;

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
    let rayEffect: ReturnType<typeof effect> | undefined;
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
      rayEffect?.dispose();
      canvasSurface?.dispose();
      gpu?.dispose();
    };

    const start = async () => {
      gpu = await init();
      if (disposed) return cleanup();

      canvasSurface = surface(gpu, canvas, { size: MARK_SIZE });
      rayEffect = effect(gpu, lightRayShader, {
        label: "wordmark-light-ray",
        set: { cfg: { ray: [pointerX, pointerY, 0, 0] } },
      });
      await rayEffect.compile(canvasSurface);
      if (disposed) return cleanup();

      mark.addEventListener("pointermove", onPointerMove);
      mark.addEventListener("pointerleave", onPointerLeave);
      const time = clock(gpu);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        renderStatic = () => {
          rayEffect?.set({ cfg: { ray: [pointerX, pointerY, 0, hovering ? 1 : 0] } });
          if (gpu && canvasSurface && rayEffect) {
            frame(gpu, (currentFrame) => currentFrame.pass(canvasSurface!, rayEffect!));
          }
        };
        renderStatic();
      } else {
        stop = frameLoop(gpu, (currentFrame) => {
          rayEffect?.set({ cfg: { ray: [pointerX, pointerY, time.time, hovering ? 1 : 0] } });
          if (canvasSurface && rayEffect) currentFrame.pass(canvasSurface, rayEffect);
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
        className="aspect-1337/336 w-[88%]"
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
        <canvas ref={canvasRef}  className="block h-full w-full" />
      </div>
    </div>
  );
});
