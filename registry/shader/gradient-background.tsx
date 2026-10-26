"use client";

import { memo, useEffect, useRef, type ComponentProps } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { cn } from "cn";
import { createShaderRenderer } from "./shader-renderer.shared";
import gradientShader from "./gradient-background.wgsl";

export interface GradientBackgroundProps extends ComponentProps<"div"> {
  speed?: number;
  intensity?: number;
  interactive?: boolean;
}

export const GradientBackground = memo(function GradientBackground({
  speed = 1,
  intensity = 0.9,
  interactive = true,
  className,
  children,
  ...props
}: GradientBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const hover = useSpring(0, { stiffness: 180, damping: 24 });
  const pointer = useRef([0.5, 0.5]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const rate = Number.isFinite(speed) ? Math.max(0, speed) : 1;
    const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 0.9;
    const track = (event: PointerEvent) => {
      if (!interactive || reducedMotion || event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      pointer.current = [(event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height];
      hover.set(1);
    };
    const leave = () => hover.set(0);
    host.addEventListener("pointermove", track);
    host.addEventListener("pointerleave", leave);
    const renderer = createShaderRenderer(canvas, gradientShader, {
      label: "gradient-background",
      uniforms: (time, size) => ({
        cfg: {
          metrics: [size[0], size[1], time * rate, brightness],
          pointer: [pointer.current[0], pointer.current[1], reducedMotion ? 0 : hover.get(), 0],
          settings: [rate, 0, 0, 0],
        },
      }),
      animated: !reducedMotion && rate > 0,
      fps: 30,
    });
    return () => {
      host.removeEventListener("pointermove", track);
      host.removeEventListener("pointerleave", leave);
      hover.jump(0);
      renderer.dispose();
    };
  }, [hover, intensity, interactive, reducedMotion, speed]);

  return (
    <div
      {...props}
      ref={hostRef}
      data-slot="gradient-background"
      className={cn("hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-background", className)}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,#052e24,#05dc7f_48%,#263b88)]">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-0" />
      </div>
      {children}
    </div>
  );
});
