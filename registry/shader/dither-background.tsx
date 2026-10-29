"use client";

import { memo, useEffect, useRef, type ComponentProps, type RefObject } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { createShaderRenderer } from "./shader-renderer.shared";
import { cn } from "cn";
import ditherShader from "./dither-background.wgsl";

type Color = readonly [number, number, number];
const defaultColor: Color = [0.02, 0.86, 0.5];
const defaultBackground: Color = [0.02, 0.04, 0.035];

export interface DitherBackgroundProps extends Omit<ComponentProps<"div">, "color"> {
  color?: Color;
  backgroundColor?: Color;
  pixelSize?: number;
  speed?: number;
  interactive?: boolean;
  interactionRef?: RefObject<HTMLElement | null>;
}

export const DitherBackground = memo(function DitherBackground({
  color = defaultColor,
  backgroundColor = defaultBackground,
  pixelSize = 3,
  speed = 0.4,
  interactive = true,
  interactionRef,
  children,
  className,
  ...props
}: DitherBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const hoverStrength = useSpring(0, { stiffness: 180, damping: 24 });
  const pixels = Number.isFinite(pixelSize) ? Math.max(1, pixelSize) : 3;
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.4;
  const [r, g, b] = color.map((channel) =>
    Math.min(1, Math.max(0, Number.isFinite(channel) ? channel : 0)),
  );
  const [br, bg, bb] = backgroundColor.map((channel) =>
    Math.min(1, Math.max(0, Number.isFinite(channel) ? channel : 0)),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let pointer = [0.5, 0.5, 0, 0];
    let ripple = [0.5, 0.5, 0, 0];
    let rippleStarted = -Infinity;
    const host = interactionRef?.current ?? canvas.parentElement?.parentElement;
    const trackPointer = (event: PointerEvent) => {
      if (!interactive || reducedMotion || event.pointerType === "touch" || !host) return;
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer = [
        (event.clientX - bounds.left) / bounds.width,
        (event.clientY - bounds.top) / bounds.height,
        1,
        0,
      ];
      hoverStrength.set(1);
    };
    const clearPointer = () => {
      hoverStrength.set(0);
    };
    const triggerRipple = (event: PointerEvent) => {
      if (!interactive || reducedMotion || !host || event.button !== 0) return;
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      ripple = [
        (event.clientX - bounds.left) / bounds.width,
        (event.clientY - bounds.top) / bounds.height,
        0,
        1,
      ];
      rippleStarted = performance.now();
      if (event.pointerType !== "mouse") clearPointer();
    };
    host?.addEventListener("pointermove", trackPointer);
    host?.addEventListener("pointerleave", clearPointer);
    host?.addEventListener("pointercancel", clearPointer);
    host?.addEventListener("pointerup", triggerRipple);

    const cleanup = () => {
      host?.removeEventListener("pointermove", trackPointer);
      host?.removeEventListener("pointerleave", clearPointer);
      host?.removeEventListener("pointercancel", clearPointer);
      host?.removeEventListener("pointerup", triggerRipple);
      hoverStrength.jump(0);
      renderer.dispose();
    };

    const renderer = createShaderRenderer(canvas, ditherShader, {
      label: "dither-background",
      fps: 30,
      animated: !reducedMotion && (rate > 0 || interactive),
      uniforms: (time, size) => {
        pointer[2] = reducedMotion ? 0 : hoverStrength.get();
        const age = (performance.now() - rippleStarted) / 1000;
        ripple[2] = Number.isFinite(age) ? age : 0;
        ripple[3] = !reducedMotion && age < 0.675 ? 1 : 0;
        return {
          cfg: {
            metrics: [size[0], size[1], pixels, time * rate],
            pointer,
            ripple,
            foreground: [r, g, b, 1],
            background: [br, bg, bb, 1],
          },
        };
      },
    });
    return cleanup;
  }, [
    pixels,
    rate,
    r,
    g,
    b,
    br,
    bg,
    bb,
    reducedMotion,
    interactive,
    interactionRef,
    hoverStrength,
  ]);

  return (
    <div
      {...props}
      data-slot="dither-background"
      className={cn(
        "hangry-background relative isolate min-h-96 overflow-hidden border border-border",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ backgroundColor: `rgb(${br * 255} ${bg * 255} ${bb * 255})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(rgb(${r * 255} ${g * 255} ${b * 255}) 30%, transparent 31%)`,
            backgroundSize: `${pixels * 2}px ${pixels * 2}px`,
            maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
          }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-0" />
      </div>
      {children}
    </div>
  );
});
