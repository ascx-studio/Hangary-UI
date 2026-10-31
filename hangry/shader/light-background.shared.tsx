"use client";

import { memo, useEffect, useRef, type ComponentProps } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { createShaderRenderer } from "./shader-renderer.shared";
import { cn } from "cn";
import ledShader from "./led-background.wgsl";
import lightRayShader from "./light-ray-background.wgsl";

export interface LightBackgroundProps extends ComponentProps<"div"> {
  speed?: number;
  interactive?: boolean;
  intensity?: number;
}

export const LightBackground = memo(function LightBackground({
  variant,
  speed = 1,
  interactive = true,
  intensity = 0.65,
  className,
  children,
  ...props
}: LightBackgroundProps & { variant: "led" | "light-ray" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const hover = useSpring(0, { stiffness: 180, damping: 24 });
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 0.65;
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    let pointer = [0.5, 0.5];
    const smoothed = [0.5, 0.5];
    let previousTime = 0;
    let surgeStart = -10;
    const track = (event: PointerEvent) => {
      if (!interactive || reducedMotion || event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer = [
        (event.clientX - bounds.left) / bounds.width,
        (event.clientY - bounds.top) / bounds.height,
      ];
      hover.set(1);
    };
    const leave = () => {
      hover.set(0);
    };
    const surge = () => {
      if (variant === "light-ray" && interactive && !reducedMotion) surgeStart = previousTime;
    };
    host.addEventListener("pointerdown", surge);
    host.addEventListener("pointermove", track);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", leave);
    const cleanup = () => {
      host.removeEventListener("pointerdown", surge);
      host.removeEventListener("pointermove", track);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      hover.jump(0);
      renderer.dispose();
    };
    const uniforms = (elapsed: number, size: readonly [number, number]) => {
      const dt = Math.min(0.05, Math.max(0, elapsed - previousTime));
      previousTime = elapsed;
      const follow = 1 - Math.exp(-dt / 0.6);
      for (let i = 0; i < 2; i++) smoothed[i] += (pointer[i] - smoothed[i]) * follow;
      const age = elapsed - surgeStart;
      const reveal = reducedMotion || rate === 0 ? 1 : Math.min(1, elapsed / 1.8);
      return {
        cfg: {
          metrics: [size[0], size[1], elapsed * rate, brightness],
          pointer: [
            ...(variant === "light-ray" ? smoothed : pointer),
            reducedMotion ? 0 : hover.get(),
            0,
          ],
          ...(variant === "light-ray"
            ? {
                animation: [
                  elapsed * (rate + 0.2),
                  1.7 - reveal * reveal * (3 - 2 * reveal) * 3.6,
                  -0.6 + age * 2.6,
                  age < 2.4 ? Math.min(1, age / 0.12) * Math.exp(-age * 1.1) : 0,
                ],
              }
            : {}),
        },
      };
    };
    const renderer = createShaderRenderer(canvas, variant === "led" ? ledShader : lightRayShader, {
      label: `${variant}-background`,
      uniforms,
      animated: !reducedMotion && (rate > 0 || interactive),
      fps: variant === "light-ray" ? 60 : 30,
    });
    return cleanup;
  }, [variant, rate, interactive, reducedMotion, hover, brightness]);

  return (
    <div
      {...props}
      ref={hostRef}
      data-slot={`${variant}-background`}
      className={cn(
        "hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-background",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 hidden dark:block"
          style={
            variant === "led"
              ? {
                  backgroundImage: "radial-gradient(circle, #334155 1px, transparent 2px)",
                  backgroundSize: "16px 16px",
                }
              : {
                  backgroundImage:
                    "repeating-conic-gradient(from 12deg, #000 0deg 5deg, #333 5.2deg 5.5deg, #000 5.8deg 12deg)",
                }
          }
        />
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              variant === "led"
                ? "radial-gradient(circle, #234a67 1px, #e6f0f7 2px) 0 0 / 16px 16px"
                : "repeating-conic-gradient(from 12deg, #edf5fa 0deg 5deg, #57758c 5.2deg 5.5deg, #edf5fa 5.8deg 12deg)",
          }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-0" />
      </div>
      {children}
    </div>
  );
});
