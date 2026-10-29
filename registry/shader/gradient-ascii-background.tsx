"use client";

import { memo, useState, type ComponentProps } from "react";
import { cn } from "cn";
import { Canvas } from "./canvas";
import shader from "./gradient-ascii-background.wgsl";

export type GradientAsciiBackgroundProps = ComponentProps<"div"> & {
  cellSize?: number;
  speed?: number;
  intensity?: number;
};

export const GradientAsciiBackground = memo(function GradientAsciiBackground({
  className,
  children,
  cellSize = 14,
  speed = 0.2,
  intensity = 1,
  ...props
}: GradientAsciiBackgroundProps = {}) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5, active: 0 });
  const size = Number.isFinite(cellSize) ? Math.max(7, Math.min(40, cellSize)) : 14;
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.2;
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 1;

  return (
    <div
      {...props}
      data-slot="gradient-ascii-background"
      className={cn("relative isolate min-h-96 overflow-hidden bg-[#09051a]", className)}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        setPointer({
          x: (event.clientX - bounds.left) / bounds.width,
          y: (event.clientY - bounds.top) / bounds.height,
          active: 1,
        });
      }}
      onPointerLeave={() => setPointer({ x: 0.5, y: 0.5, active: 0 })}
    >
      <Canvas
        aria-label="Animated gradient ASCII background"
        role="img"
        shader={shader}
        label="gradient-ascii-background"
        fallback="linear-gradient(135deg, #180b3d, #073b68 48%, #062b2e)"
        className="absolute inset-0 -z-10 h-full min-h-0 border-0 bg-transparent"
        animated={rate > 0}
        fps={30}
        uniforms={(time, canvasSize) => ({
          cfg: {
            metrics: [canvasSize[0], canvasSize[1], time * rate, brightness],
            pointer: [pointer.x, pointer.y, pointer.active, 0],
            settings: [size, 0, 0, 0],
          },
        })}
      />
      {children}
    </div>
  );
});
