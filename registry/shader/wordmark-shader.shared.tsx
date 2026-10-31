"use client";

import { memo, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { createShaderRenderer } from "./shader-renderer.shared";

type RendererOptions = Parameters<typeof createShaderRenderer>[2];
export interface WordmarkSourceProps {
  src?: string;
  alt?: string;
}

interface WordmarkShaderProps extends WordmarkSourceProps {
  shader: Parameters<typeof createShaderRenderer>[1];
  label: string;
  uniforms: (
    time: number,
    x: number,
    y: number,
    hovering: boolean,
  ) => ReturnType<RendererOptions["uniforms"]>;
  surface?: RendererOptions["surface"];
  baseBrightness?: number;
}

export const WordmarkShader = memo(function WordmarkShader({
  shader,
  label,
  uniforms,
  surface,
  baseBrightness = 0,
  src = "/wordmark.svg",
  alt = "Hangry UI",
}: WordmarkShaderProps) {
  const image = `url(${JSON.stringify(src)})`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const mark = markRef.current;
    if (!canvas || !mark) return;
    let x = 0.5;
    let y = 0.5;
    let hovering = false;
    const renderer = createShaderRenderer(canvas, shader, {
      label,
      surface,
      animated: !reducedMotion,
      uniforms: (time) => uniforms(time, x, y, hovering),
    });
    const move = (event: PointerEvent) => {
      const bounds = mark.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      hovering = true;
      renderer.render();
    };
    const leave = () => {
      hovering = false;
      renderer.render();
    };
    mark.addEventListener("pointermove", move);
    mark.addEventListener("pointerleave", leave);
    mark.addEventListener("pointercancel", leave);
    return () => {
      mark.removeEventListener("pointermove", move);
      mark.removeEventListener("pointerleave", leave);
      mark.removeEventListener("pointercancel", leave);
      renderer.dispose();
    };
  }, [shader, label, uniforms, surface, reducedMotion]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black isolate">
      <div
        ref={markRef}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className="aspect-[1337/336] w-[88%]"
        style={{
          backgroundImage: image,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          maskImage: image,
          maskPosition: "center",
          maskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskImage: image,
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
        }}
      >
        <div className="h-full w-full mix-blend-multiply" style={{ opacity: 1 - baseBrightness }}>
          <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full grayscale" />
        </div>
      </div>
    </div>
  );
});
