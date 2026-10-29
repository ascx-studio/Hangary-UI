"use client";

import { memo, useEffect, useRef, type ReactNode, type ComponentProps } from "react";
import { useReducedMotion } from "motion/react";
import { createShaderRenderer, type PostProcessOptions } from "./shader-renderer.shared";
import { cn } from "cn";

type RendererOptions = Parameters<typeof createShaderRenderer>[2];
export interface CanvasProps extends ComponentProps<"div"> {
  shader: Parameters<typeof createShaderRenderer>[1];
  label?: string;
  fallback: string;
  fallbackContent?: ReactNode;
  uniforms: RendererOptions["uniforms"];
  animated?: boolean;
  fps?: number;
  dpr?: number | [number, number];
  postProcess?: PostProcessOptions;
}

/** Shared rendering only; consumers own uniforms and pointer behavior. */
export const Canvas = memo(function Canvas({
  shader,
  label = "shader-canvas",
  fallback,
  fallbackContent,
  uniforms,
  animated = true,
  fps = 30,
  dpr = 1,
  postProcess,
  className,
  children,
  ...props
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const latestUniforms = useRef(uniforms);
  const rendererRef = useRef<ReturnType<typeof createShaderRenderer> | null>(null);
  const reducedMotion = useReducedMotion();
  const minDpr = typeof dpr === "number" ? dpr : dpr[0];
  const maxDpr = typeof dpr === "number" ? dpr : dpr[1];
  useEffect(() => {
    latestUniforms.current = uniforms;
    rendererRef.current?.render();
  }, [uniforms]);
  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = createShaderRenderer(canvasRef.current, shader, {
      label,
      uniforms: (time, size) => latestUniforms.current(time, size),
      animated: animated && !reducedMotion,
      fps,
      surface: { dpr: minDpr === maxDpr ? minDpr : [minDpr, maxDpr] },
      postProcess,
    });
    rendererRef.current = renderer;
    return () => {
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [shader, label, animated, reducedMotion, fps, minDpr, maxDpr, postProcess]);
  return (
    <div
      {...props}
      data-slot={label}
      className={cn(
        "hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-black",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ backgroundImage: fallback }} />
        {fallbackContent}
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-0" />
      </div>
      {children}
    </div>
  );
});
