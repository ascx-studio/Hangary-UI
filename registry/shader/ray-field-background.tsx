"use client";

import { memo, type ComponentProps } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { cn } from "cn";
import { Canvas } from "./canvas";
import shader from "./wordmark-light-ray.wgsl";

export type RayFieldBackgroundProps = ComponentProps<"div"> & {
  speed?: number;
  intensity?: number;
  interactive?: boolean;
};

export const RayFieldBackground = memo(function RayFieldBackground({
  className,
  children,
  speed = 1,
  intensity = 1,
  interactive = true,
  onPointerMove,
  onPointerLeave,
  ...props
}: RayFieldBackgroundProps = {}) {
  const reducedMotion = useReducedMotion();
  const x = useSpring(0.5, { stiffness: 180, damping: 24 });
  const y = useSpring(0.5, { stiffness: 180, damping: 24 });
  const hover = useSpring(0, { stiffness: 220, damping: 26 });
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 1;
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 1;

  return (
    <div
      {...props}
      data-slot="ray-field-background"
      className={cn("relative isolate min-h-96 overflow-hidden bg-background", className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!interactive || reducedMotion || event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        x.set(Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)));
        y.set(Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)));
        hover.set(1);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        x.set(0.5);
        y.set(0.5);
        hover.set(0);
      }}
    >
      <Canvas
        aria-label="Animated blue light ray field"
        role="img"
        shader={shader}
        label="ray-field-background"
        lightFallback="linear-gradient(100deg, #f0f7fc 30%, #164880 50%, #f0f7fc 65%)"
        fallback="radial-gradient(ellipse at 50% 50%, #1d5f9a 0%, transparent 28%), linear-gradient(110deg, #02070d, #071522 48%, #02070d)"
        className="absolute inset-0 -z-10 h-full min-h-0 border-0 bg-transparent"
        animated={rate > 0}
        fps={30}
        uniforms={(time, size) => ({
          cfg: {
            ray: [
              x.get() * size[0],
              y.get() * size[1],
              time * rate,
              (interactive && !reducedMotion ? hover.get() : 0) * brightness,
            ],
          },
        })}
      />
      {children}
    </div>
  );
});
