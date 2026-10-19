import type { ComponentProps, CSSProperties } from "react";
import { cn } from "cn";
import "./background-motion.css";

interface BeamsBackgroundProps extends ComponentProps<"div"> {
  beamColor?: string;
  accentColor?: string;
  speed?: number;
}

export function BeamsBackground({ beamColor = "#38bdf8", accentColor = "#818cf8", speed = 14, children, className, style, ...props }: BeamsBackgroundProps = {}) {
  return <div {...props} className={cn("hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-background", className)} style={{ "--beam-color": beamColor, "--beam-accent": accentColor, "--background-speed": `${Math.max(1, speed)}s`, ...style } as CSSProperties}>
    <div data-background-layer="beams" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ maskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 80%)" }}>
      <div className="hangry-beams-layer absolute -left-1/2 -top-1/2 h-[200%] w-[200%] opacity-35 blur-xl" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 80px, var(--beam-color) 110px, transparent 160px, var(--beam-accent) 200px, transparent 260px)" }} />
    </div>
    {children}
  </div>;
}
