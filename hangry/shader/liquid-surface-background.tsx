"use client";

import { memo, useState, type ComponentProps } from "react";
import { cn } from "cn";
import { Canvas } from "./canvas";
import shader from "./liquid-surface-background.wgsl";
import bloomShader from "./liquid-surface-bloom.wgsl";

const liquidSurfaceBloom = {
  label: "liquid-surface-bloom",
  source: bloomShader,
  uniforms: (_time: number, size: readonly [number, number]) => ({
    bloom: {
      resolution: size,
      threshold: 0.55,
      intensity: 1.4,
      radius: 3.5,
      enabled: 1,
      pad1: 0,
      pad2: 0,
    },
  }),
};

export type LiquidSurfaceBackgroundProps = ComponentProps<"div"> & {
  speed?: number;
  distortion?: number;
  intensity?: number;
  interactive?: boolean;
};

export const LiquidSurfaceBackground = memo(function LiquidSurfaceBackground({
  className,
  children,
  speed = 0.35,
  distortion = 0.8,
  intensity = 1,
  interactive = true,
  onPointerMove,
  onPointerLeave,
  ...props
}: LiquidSurfaceBackgroundProps = {}) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5, hover: 0 });
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.35;
  const warp = Number.isFinite(distortion) ? Math.max(0, Math.min(2, distortion)) : 0.8;
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 1;

  return (
    <div
      {...props}
      data-slot="liquid-surface-background"
      className={cn("relative isolate min-h-96 overflow-hidden bg-background", className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!interactive || event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        setPointer({
          x: (event.clientX - bounds.left) / bounds.width,
          y: (event.clientY - bounds.top) / bounds.height,
          hover: 1,
        });
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setPointer({ x: 0.5, y: 0.5, hover: 0 });
      }}
    >
      <Canvas
        aria-label="Animated liquid surface with interactive metallic reflections"
        role="img"
        shader={shader}
        label="liquid-surface-background"
        lightFallback="radial-gradient(ellipse at 30% 20%, #fff 0%, transparent 30%), linear-gradient(135deg, #b8d4e0, #eff7fa 48%, #a3c3cf)"
        fallback="radial-gradient(ellipse at 30% 20%, #edf5ff 0%, transparent 18%), radial-gradient(ellipse at 70% 70%, #315c91 0%, transparent 35%), linear-gradient(135deg, #090b12, #33465e 48%, #0b1019)"
        className="absolute inset-0 -z-10 h-full min-h-0 border-0 bg-transparent"
        animated={rate > 0}
        fps={30}
        postProcess={liquidSurfaceBloom}
        uniforms={(time, size) => ({
          cfg: {
            metrics: [size[0], size[1], time, brightness],
            pointer: [pointer.x, pointer.y, interactive ? pointer.hover : 0, 0],
            settings: [rate, warp, 0.3, 0],
          },
        })}
      />
      {children}
    </div>
  );
});
