"use client";

import type { CSSProperties } from "react";
import "./kinetic-type-lab.css";

export function KineticTypeLab({
  text = "MAKE WAVES",
  amplitude = 24,
  speed = 1.8,
  tracking = -0.07,
  playing = true,
  className = "",
}: {
  text?: string;
  amplitude?: number;
  speed?: number;
  tracking?: number;
  playing?: boolean;
  className?: string;
}) {
  const displayText = text.trim() || "MAKE WAVES";
  const letters = Array.from(displayText);
  const stageStyle = {
    "--wave-height": `${Math.max(0, Math.min(amplitude, 48))}px`,
    "--wave-speed": `${Math.max(0.8, Math.min(speed, 4))}s`,
    "--wave-tracking": `${Math.max(-0.1, Math.min(tracking, 0.08))}em`,
  } as CSSProperties;

  return (
    <section aria-label="Kinetic type lab" className={`ktl w-full overflow-hidden border border-white/15 ${className}`}>
      <div className="ktl-stage relative isolate flex min-h-[390px] flex-col justify-between overflow-hidden px-5 py-5 text-[#f3f9e9] sm:min-h-[490px] sm:px-8 sm:py-7" style={stageStyle}>
        <div className="ktl-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="ktl-glow pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full sm:size-96" aria-hidden="true" />
        <header className="flex flex-wrap items-start justify-between gap-3 font-mono text-[10px] font-semibold uppercase tracking-[.23em]">
          <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#d5ff55] shadow-[0_0_18px_#d5ff55]" />Kinetic / Type Lab</span>
          <span className="text-[#b9cbb6]">Interactive study — 001</span>
        </header>

        <div className="relative py-12 text-center">
          <p className="sr-only" aria-live="polite">{displayText}</p>
          <div aria-hidden="true" className={`ktl-word flex flex-wrap justify-center text-[clamp(3.25rem,10vw,9rem)] font-black uppercase leading-[.86] ${playing ? "" : "ktl-paused"}`}>
            {letters.map((letter, index) => (
              <span key={`${index}-${letter}`} className="ktl-letter inline-block" style={{ animationDelay: `${-index * 0.12}s` }}>
                {letter === " " ? "\u00a0" : letter}
              </span>
            ))}
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[.3em] text-[#bdd0bb]">Words in motion. Made by you.</p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-white/20 pt-4 font-mono text-[10px] uppercase tracking-[.18em] text-[#b9cbb6]">
          <span>Type as an experience</span><span>{playing ? "Motion on" : "Motion paused"}</span>
        </div>
      </div>
    </section>
  );
}
