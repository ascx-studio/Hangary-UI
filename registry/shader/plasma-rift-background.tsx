"use client";

import { memo } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { Canvas } from "./canvas";
import type { ProceduralBackgroundProps } from "./procedural-background.shared";
import shader from "./plasma-rift-background.wgsl";

export type PlasmaRiftBackgroundProps = ProceduralBackgroundProps;

export const PlasmaRiftBackground = memo(function PlasmaRiftBackground({
  speed = 0.2, intensity = 0.9, interactive = true,
  onPointerMove, onPointerLeave, onPointerCancel, ...props
}: PlasmaRiftBackgroundProps = {}) {
  const reducedMotion = useReducedMotion();
  // Smooth the displacement itself, so entry, movement, and exit never snap the vortex.
  const offsetX = useSpring(0, { stiffness: 65, damping: 24 });
  const offsetY = useSpring(0, { stiffness: 65, damping: 24 });
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.2;
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 0.9;
  const leave = () => { offsetX.set(0); offsetY.set(0); };
  return <Canvas {...props} shader={shader} label="plasma-rift-background"
    fallback="radial-gradient(ellipse at center, #02100d 5%, #000 25%, #376b66 28%, #b9fff2 29%, #000 34%, #000 60%, #35746e 63%, #000 67%)"
    animated={rate > 0 || interactive}
    uniforms={(time, size) => ({ cfg: {
      metrics: [size[0], size[1], time * rate, brightness],
      pointer: interactive && !reducedMotion ? [0.5 + offsetX.get(), 0.5 + offsetY.get(), 1, 0] : [0.5, 0.5, 0, 0],
      settings: [0, 0, 0, 0],
    } })}
    onPointerMove={event => {
      onPointerMove?.(event);
      if (event.defaultPrevented || !interactive || reducedMotion || event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      offsetX.set(Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5)));
      offsetY.set(Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5)));
    }}
    onPointerLeave={event => { onPointerLeave?.(event); leave(); }}
    onPointerCancel={event => { onPointerCancel?.(event); leave(); }}
  />;
});
