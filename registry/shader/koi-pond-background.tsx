"use client";

import { memo, useRef, type ComponentProps } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { Canvas } from "./canvas";
import shader from "./koi-pond-background.wgsl";

export interface KoiPondBackgroundProps extends ComponentProps<"div"> {
  speed?: number;
  intensity?: number;
  interactive?: boolean;
}

export const KoiPondBackground = memo(function KoiPondBackground({
  speed = 0.2,
  intensity = 0.9,
  interactive = true,
  onClick,
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  ...props
}: KoiPondBackgroundProps = {}) {
  const reducedMotion = useReducedMotion();
  const cursorX = useSpring(0.5, { stiffness: 80, damping: 22 });
  const cursorY = useSpring(0.5, { stiffness: 80, damping: 22 });
  const hover = useSpring(0, { stiffness: 65, damping: 24 });
  const elapsed = useRef(0);
  const splash = useRef({ x: 0.5, y: 0.5, start: -100 });
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.2;
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 0.9;
  return (
    <Canvas
      {...props}
      shader={shader}
      label="koi-pond-background"
      fallback="radial-gradient(ellipse at 35% 45%, #355b3d, #102a1c 70%)"
      animated={rate > 0 || interactive}
      uniforms={(time, size) => {
        elapsed.current = time;
        return {
          cfg: {
            metrics: [size[0], size[1], time * rate, brightness],
            pointer: [
              cursorX.get(),
              cursorY.get(),
              interactive && !reducedMotion ? hover.get() : 0,
              rate,
            ],
            settings: [
              splash.current.x,
              splash.current.y,
              Math.max(0, time - splash.current.start),
              interactive && !reducedMotion ? 1 : 0,
            ],
          },
        };
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (
          event.defaultPrevented ||
          !interactive ||
          reducedMotion ||
          event.pointerType === "touch"
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        cursorX.set(Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)));
        cursorY.set(Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)));
        hover.set(1);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        hover.set(0);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        hover.set(0);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !interactive || reducedMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        splash.current = {
          x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
          y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
          start: elapsed.current,
        };
      }}
    />
  );
});
