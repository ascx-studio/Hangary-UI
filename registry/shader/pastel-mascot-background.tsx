"use client";

import { memo, useState, type ComponentProps } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { cn } from "cn";
import { Canvas } from "./canvas";
import shader from "./pastel-mascot-background.wgsl";

const shapePath =
  "M230.809 115.385V249.411C230.809 269.923 214.985 287.282 194.495 288.411C184.544 288.949 175.364 285.718 168.26 280C159.746 273.154 147.769 273.461 139.178 280.23C132.638 285.384 124.381 288.462 115.379 288.462C106.377 288.462 98.1451 285.384 91.6055 280.23C82.912 273.385 70.9353 273.385 62.2415 280.23C55.7532 285.334 47.598 288.411 38.7246 288.462C17.4132 288.615 0 270.667 0 249.359V115.385C0 51.6667 51.6756 0 115.404 0C179.134 0 230.809 51.6667 230.809 115.385Z";
const mask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 231 289"><path fill="white" d="${shapePath}"/></svg>`)}")`;

export type PastelMascotBackgroundProps = ComponentProps<"div"> & {
  speed?: number;
  intensity?: number;
  interactive?: boolean;
};

export const PastelMascotBackground = memo(function PastelMascotBackground({
  className,
  speed = 0.5,
  intensity = 1,
  interactive = true,
  onPointerMove,
  ...props
}: PastelMascotBackgroundProps = {}) {
  const reducedMotion = useReducedMotion();
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.5;
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 1;

  return (
    <div
      {...props}
      data-slot="pastel-mascot-background"
      className={cn("relative mx-auto w-full max-w-60", className)}
      style={props.style}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!interactive || reducedMotion || event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.08;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.08;
        setEyeOffset({
          x: Math.max(-8, Math.min(8, x * 231)),
          y: Math.max(-8, Math.min(8, y * 289)),
        });
      }}
      onPointerLeave={(event) => {
        props.onPointerLeave?.(event);
        setEyeOffset({ x: 0, y: 0 });
      }}
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -8, 0], scaleY: [1, 1.04, 1] }}
        transition={
          reducedMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformOrigin: "top center" }}
      >
        <Canvas
          aria-label="Pastel floating mascot with a pink, sky-blue, and navy mesh gradient"
          role="img"
          shader={shader}
          label="pastel-mascot-gradient"
          fallback="radial-gradient(ellipse at 28% 25%, #ff7bb8, transparent 44%), radial-gradient(ellipse at 72% 30%, #58bff5, transparent 48%), radial-gradient(ellipse at 55% 75%, #315bb5, #15142b 70%)"
          fallbackContent={
            <motion.div
              aria-hidden="true"
              className="absolute inset-[-18%] bg-[radial-gradient(ellipse_at_28%_25%,#ffb3d9_0%,transparent_44%),radial-gradient(ellipse_at_72%_30%,#87ceeb_0%,transparent_48%),radial-gradient(ellipse_at_55%_75%,#4a90e2_0%,transparent_58%),radial-gradient(ellipse_at_20%_72%,#2c3e50_0%,#1a1a2e_72%)] bg-[length:140%_140%]"
              animate={
                reducedMotion ? undefined : { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }
              }
              transition={
                reducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }
            />
          }
          className="aspect-[231/289] min-h-0 overflow-visible border-0 bg-transparent"
          style={{ maskImage: mask, WebkitMaskImage: mask }}
          animated={rate > 0}
          fps={30}
          uniforms={(time, size) => ({
            cfg: {
              metrics: [size[0], size[1], time * rate, brightness],
              pointer: [0.5, 0.5, interactive && !reducedMotion ? 1 : 0, 0],
            },
          })}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 231 289"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            {[80, 150].map((cx) => (
              <ellipse
                key={cx}
                cx={cx + eyeOffset.x}
                cy={120 + eyeOffset.y}
                rx="20"
                ry="30"
                fill="#17172b"
              />
            ))}
          </svg>
        </Canvas>
      </motion.div>
    </div>
  );
});
