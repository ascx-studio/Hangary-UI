import type { ComponentProps, CSSProperties } from "react";
import { cn } from "cn";
import "./background-motion.css";

interface AuroraBackgroundProps extends ComponentProps<"div"> {
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  speed?: number;
}

export function AuroraBackground({ colorOne = "#10b981", colorTwo = "#06b6d4", colorThree = "#8b5cf6", speed = 18, children, className, style, ...props }: AuroraBackgroundProps = {}) {
  return <div {...props} className={cn("hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-background", className)} style={{ "--background-speed": `${Math.max(1, speed)}s`, ...style } as CSSProperties}>
    <div data-background-layer="aurora" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ maskImage: "linear-gradient(black 20%, transparent)" }}>
      <div className="hangry-aurora-layer absolute -left-1/4 -top-1/2 h-full w-full rounded-[50%] opacity-40 blur-3xl" style={{ background: `radial-gradient(ellipse, ${colorOne}, transparent 65%)` }} />
      <div className="hangry-aurora-layer absolute -right-1/4 -top-1/3 h-full w-full rounded-[50%] opacity-40 blur-3xl" style={{ background: `radial-gradient(ellipse, ${colorTwo}, transparent 65%)` }} />
      <div className="hangry-aurora-layer absolute left-1/4 top-0 h-full w-3/4 rounded-[50%] opacity-35 blur-3xl" style={{ background: `radial-gradient(ellipse, ${colorThree}, transparent 65%)` }} />
    </div>
    {children}
  </div>;
}
