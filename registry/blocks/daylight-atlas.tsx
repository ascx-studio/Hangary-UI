"use client";

import { useState } from "react";
import { SeasonTimeline, seasonChapters } from "../components/season-timeline";
import { AuroraVeil } from "../shader/aurora-veil";

const tints: Record<string, string> = {
  "01": "var(--info)",
  "02": "var(--warning)",
  "03": "var(--chart-3)",
  "04": "var(--success)",
};

export function DaylightAtlas({ className = "" }: { className?: string }) {
  const [chapter, setChapter] = useState(seasonChapters[0]);
  return <section aria-label="Daylight atlas experiment" className={`w-full border border-border bg-secondary text-secondary-foreground ${className}`}>
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary-foreground/10 px-5 py-4"><span className="font-mono text-xs uppercase tracking-[.18em]">FIELD NOTES / 014</span><span className="font-mono text-[10px] text-secondary-foreground/55">LIGHT IS A PLACE YOU CAN VISIT</span></header>
    <div className="grid lg:grid-cols-[1.2fr_.8fr]">
      <div className="relative min-h-72 lg:min-h-[480px]"><AuroraVeil tint={tints[chapter.id]} /><div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-secondary to-transparent p-6 pt-24"><span className="font-mono text-xs" style={{ color: chapter.color }}>{chapter.time} / LOCAL SKY</span><h3 className="mt-1 text-3xl font-light">{chapter.name}</h3></div></div>
      <div className="flex flex-col justify-center p-5 sm:p-7"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-secondary-foreground/50">An interactive field guide</p><h2 className="mt-3 text-4xl font-light leading-tight tracking-tight">The shape of a day.</h2><p className="my-5 text-sm leading-6 text-secondary-foreground/65">Move through four quiet moments. Each one changes the color of the sky above.</p><SeasonTimeline selected={chapter.id} onSelect={setChapter} /></div>
    </div>
  </section>;
}
