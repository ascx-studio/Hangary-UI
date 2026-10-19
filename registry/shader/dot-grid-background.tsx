"use client";

import { memo, useEffect, useRef, type ComponentProps, type CSSProperties } from "react";
import { LazyMotion, domAnimation, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "cn";

interface DotGridBackgroundProps extends ComponentProps<"div"> {
  dotColor?: string;
  highlightColor?: string;
  gap?: number;
  dotSize?: number;
  fade?: boolean;
}

export const DotGridBackground = memo(function DotGridBackground({
  dotColor = "var(--muted-foreground)",
  highlightColor = "var(--primary)",
  gap = 24,
  dotSize = 1,
  fade = true,
  children,
  className,
  style,
  ...props
}: DotGridBackgroundProps = {}) {
  const highlight = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(-1000);
  const pointerY = useMotionValue(-1000);
  const opacity = useSpring(0, { stiffness: 300, damping: 30 });
  const reducedMotion = useReducedMotion();
  const cell = Math.max(4, gap);
  const mask = useMotionTemplate`radial-gradient(circle ${cell * 2.5}px at ${pointerX}px ${pointerY}px, black 10%, transparent 100%)`;

  useEffect(() => {
    const host = highlight.current?.parentElement;
    if (!host) return;
    const show = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (reducedMotion) opacity.jump(1);
      else opacity.set(1);
    };
    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      const x = event.clientX - bounds.left - host.clientLeft;
      const y = event.clientY - bounds.top - host.clientTop;
      pointerX.set(Math.floor(x / cell) * cell + cell / 2);
      pointerY.set(Math.floor(y / cell) * cell + cell / 2);
    };
    const hide = () => {
      if (reducedMotion) opacity.jump(0);
      else opacity.set(0);
    };
    host.addEventListener("pointerenter", show, { passive: true });
    host.addEventListener("pointermove", trackPointer, { passive: true });
    host.addEventListener("pointerleave", hide);
    return () => {
      host.removeEventListener("pointerenter", show);
      host.removeEventListener("pointermove", trackPointer);
      host.removeEventListener("pointerleave", hide);
    };
  }, [cell, opacity, pointerX, pointerY, reducedMotion]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        {...props}
        className={cn("hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-background", className)}
        style={{
          "--dot-color": dotColor,
          "--dot-highlight-color": highlightColor,
          "--dot-gap": `${cell}px`,
          "--dot-size": `${Math.max(0.5, dotSize)}px`,
          ...style,
        } as CSSProperties}
      >
        <div
          data-background-layer="dots"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, var(--dot-color) var(--dot-size), transparent var(--dot-size))",
            backgroundSize: "var(--dot-gap) var(--dot-gap)",
            maskImage: fade ? "radial-gradient(ellipse at center, black 25%, transparent 80%)" : undefined,
          }}
        />
        <m.div
          ref={highlight}
          data-background-layer="dots-highlight"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            opacity,
            transition: "none",
            backgroundImage: "radial-gradient(circle, var(--dot-highlight-color) calc(var(--dot-size) + 3px), transparent calc(var(--dot-size) + 3px))",
            backgroundSize: "var(--dot-gap) var(--dot-gap)",
            maskImage: mask,
          }}
        />
        {children}
      </div>
    </LazyMotion>
  );
});
