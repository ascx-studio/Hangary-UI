import type { ComponentProps, CSSProperties } from "react";
import "./background-motion.css";
import { cn } from "cn";

interface SpotlightGridBackgroundProps extends ComponentProps<"div"> {
  spotlightColor?: string;
  gridColor?: string;
  gridSize?: number;
}

export function SpotlightGridBackground({ spotlightColor = "var(--primary)", gridColor = "var(--border)", gridSize = 48, children, className, style, ...props }: SpotlightGridBackgroundProps = {}) {
  return <div {...props} className={cn("hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-background", className)} style={{ "--spotlight-color": spotlightColor, "--grid-color": gridColor, "--grid-size": `${Math.max(8, gridSize)}px`, ...style } as CSSProperties}>
    <div data-background-layer="spotlight" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-25" style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, var(--spotlight-color), transparent 65%)" }} />
    <div data-background-layer="grid" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundImage: "linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)", backgroundSize: "var(--grid-size) var(--grid-size)", maskImage: "radial-gradient(ellipse at 50% 0%, black, transparent 80%)" }} />
    {children}
  </div>;
}
