"use client";

import { memo, useEffect, useRef, type ComponentProps } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { createShaderRenderer } from "./shader-renderer.shared";
import { cn } from "cn";
import topoShader from "./topographic-contour-map.wgsl";

type Color = readonly [number, number, number];
const defaultBackground: Color = [0.012, 0.012, 0.012];
const palettes = {
  studio: [
    [0.157, 0.235, 0.275],
    [0.392, 0.706, 0.824],
    [0.627, 0.863, 1],
  ],
  amber: [
    [1, 0.549, 0.314],
    [1, 0.745, 0.471],
    [1, 0.902, 0.706],
  ],
  teal: [
    [0.392, 1, 0.941],
    [0.588, 1, 0.961],
    [0.784, 1, 1],
  ],
  violet: [
    [0.706, 0.549, 1],
    [0.824, 0.706, 1],
    [0.941, 0.863, 1],
  ],
} as const;

export interface TopographicContourMapProps extends Omit<ComponentProps<"div">, "color"> {
  color?: Color;
  colorScheme?: keyof typeof palettes;
  mouseInfluence?: boolean;
  showLabels?: boolean;
  fadeLeft?: boolean;
  backgroundColor?: Color;
  scale?: number;
  density?: number;
  lineWidth?: number;
  speed?: number;
}

export const TopographicContourMap = memo(function TopographicContourMap({
  color,
  colorScheme = "amber",
  mouseInfluence = true,
  showLabels = true,
  fadeLeft = true,
  backgroundColor = defaultBackground,
  scale = 3,
  density = 24,
  lineWidth = 1,
  speed = 0.08,
  className,
  ...props
}: TopographicContourMapProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const hover = useSpring(0, { stiffness: 140, damping: 24 });
  const press = useSpring(0, { stiffness: 140, damping: 24 });
  const selected = palettes[colorScheme];
  const zoom = Number.isFinite(scale) ? Math.max(0.1, scale) : 3;
  const levels = Number.isFinite(density) ? Math.min(100, Math.max(2, density)) : 24;
  const width = Number.isFinite(lineWidth) ? Math.min(8, Math.max(0.25, lineWidth)) : 1;
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.08;
  const [r, g, b] = (color ?? selected[1]).map((channel) =>
    Number.isFinite(channel) ? Math.max(0, Math.min(1, channel)) : 0,
  );
  const [br, bg, bb] = backgroundColor.map((channel) =>
    Number.isFinite(channel) ? Math.max(0, Math.min(1, channel)) : 0,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = hostRef.current;
    let pointer = [0.5, 0.5, 0, 0];
    const track = (event: PointerEvent) => {
      if (!mouseInfluence || reducedMotion || event.pointerType === "touch" || !host) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer[0] = (event.clientX - rect.left) / rect.width;
      pointer[1] = (event.clientY - rect.top) / rect.height;
      hover.set(1);
    };
    const leave = () => {
      hover.set(0);
      press.set(0);
    };
    const down = (event: PointerEvent) => {
      track(event);
      if (event.button === 0 && event.pointerType !== "touch") press.set(1);
    };
    const up = () => {
      press.set(0);
    };
    host?.addEventListener("pointermove", track);
    host?.addEventListener("pointerleave", leave);
    host?.addEventListener("pointercancel", leave);
    host?.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    const cleanup = () => {
      host?.removeEventListener("pointermove", track);
      host?.removeEventListener("pointerleave", leave);
      host?.removeEventListener("pointercancel", leave);
      host?.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      hover.jump(0);
      press.jump(0);
      renderer.dispose();
    };
    const renderer = createShaderRenderer(canvas, topoShader, {
      label: "topographic-contour-map",
      fps: 30,
      animated: !reducedMotion && (rate > 0 || mouseInfluence),
      uniforms: (time, size) => {
        pointer = [
          pointer[0],
          pointer[1],
          reducedMotion ? 0 : hover.get(),
          reducedMotion ? 0 : press.get(),
        ];
        return {
          cfg: {
            metrics: [size[0], size[1], zoom, time * rate],
            contours: [levels, width, 0, 0],
            pointer,
            options: [Number(showLabels), Number(fadeLeft), 0, 0],
            low: [...(color ? [r * 0.5, g * 0.5, b * 0.5] : selected[0]), 1],
            high: [
              ...(color
                ? [Math.min(1, r * 1.3), Math.min(1, g * 1.3), Math.min(1, b * 1.3)]
                : selected[2]),
              1,
            ],
            foreground: [r, g, b, 1],
            background: [br, bg, bb, 1],
          },
        };
      },
    });
    return cleanup;
  }, [
    zoom,
    levels,
    width,
    rate,
    r,
    g,
    b,
    br,
    bg,
    bb,
    reducedMotion,
    mouseInfluence,
    showLabels,
    fadeLeft,
    selected,
    color,
    hover,
    press,
  ]);

  return (
    <div
      {...props}
      ref={hostRef}
      data-slot="topographic-contour-map"
      className={cn(
        " relative isolate min-h-96 overflow-hidden border border-border",
        className,
      )}
    >

        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-0" />

    </div>
  );
});
