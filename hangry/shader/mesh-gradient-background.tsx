"use client";

import { memo, useState, type ComponentProps } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { cn } from "cn";
import { Canvas } from "@/hangry/shader/canvas";
import shader from "@/hangry/shader/pastel-mascot-background.wgsl";

export type MeshGradientBackgroundProps = ComponentProps<"div"> & {
  speed?: number;
  intensity?: number;
  interactive?: boolean;
};

export const MeshGradientBackground = memo(function MeshGradientBackground({
  className,
  children,
  speed = 1,
  intensity = 1,
  interactive = true,
  onPointerMove,
  onPointerLeave,
  ...props
}: MeshGradientBackgroundProps = {}) {
  const reducedMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5, active: 0 });
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 1;
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 1;

  return (
    <div
      {...props}
      data-slot="mesh-gradient-background"
      className={cn(
        "relative isolate min-h-96 overflow-hidden border border-border bg-background",
        className,
      )}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!interactive || reducedMotion || event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: (event.clientX - bounds.left) / bounds.width,
          y: (event.clientY - bounds.top) / bounds.height,
          active: 1,
        });
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setPointer({ x: 0.5, y: 0.5, active: 0 });
      }}
    >
      <Canvas
        aria-label="Animated pastel mesh gradient"
        role="img"
        shader={shader}
        label="mesh-gradient-background"
        lightFallback="radial-gradient(ellipse at 28% 25%, #ffd4e5, transparent 44%), radial-gradient(ellipse at 72% 30%, #b8e5f7, transparent 48%), linear-gradient(135deg, #d4e5f0, #f5edf9)"
        fallback="radial-gradient(ellipse at 28% 25%, #ffb3d9, transparent 44%), radial-gradient(ellipse at 72% 30%, #87ceeb, transparent 48%), radial-gradient(ellipse at 55% 75%, #4a90e2, transparent 58%), radial-gradient(ellipse at 20% 72%, #2c3e50, #1a1a2e 72%)"
        fallbackContent={
          <motion.div
            aria-hidden="true"
            className="absolute inset-[-18%]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 28% 25%, #ffb3d9 0%, transparent 44%), radial-gradient(ellipse at 72% 30%, #87ceeb 0%, transparent 48%), radial-gradient(ellipse at 55% 75%, #4a90e2 0%, transparent 58%), radial-gradient(ellipse at 20% 72%, #2c3e50 0%, #1a1a2e 72%)",
              backgroundSize: "140% 140%",
            }}
            animate={
              reducedMotion
                ? undefined
                : {
                    x: ["-6%", "6%", "-6%"],
                    y: ["-4%", "5%", "-4%"],
                    scale: [1, 1.08, 1],
                  }
            }
            transition={
              reducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }
          />
        }
        className="absolute inset-0 -z-10 h-full min-h-0 border-0 bg-transparent"
        animated={rate > 0}
        fps={30}
        uniforms={(time, size) => ({
          cfg: {
            metrics: [size[0], size[1], time * rate, brightness],
            pointer: [pointer.x, pointer.y, interactive && !reducedMotion ? pointer.active : 0, 0],
          },
        })}
      />
      {children}
    </div>
  );
});
