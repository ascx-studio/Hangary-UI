"use client";

import { useState } from "react";
import { SignalDial } from "../components/signal-dial";
import { Interference } from "../shader/interference";

const stations = [
  { name: "Forest floor", description: "A quiet place between the trees.", band: "ORGANIC / LOW FREQUENCY", value: 18 },
  { name: "Night transmission", description: "Signals from somewhere after dark.", band: "AMBIENT / DEEP SPACE", value: 52 },
  { name: "Solar drift", description: "Slow waves from a warmer world.", band: "TEXTURAL / OPEN AIR", value: 84 },
];

export function ListeningStation({ title = "Find your frequency.", className = "" }: { title?: string; className?: string }) {
  const [frequency, setFrequency] = useState(52);
  const station = stations.reduce((nearest, candidate) => Math.abs(candidate.value - frequency) < Math.abs(nearest.value - frequency) ? candidate : nearest);
  return (
    <section aria-label="Listening station visualizer" className={`w-full overflow-hidden border border-border bg-secondary text-secondary-foreground ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary-foreground/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[.2em]">
        <span className="flex items-center gap-2"><span className="h-2 w-2 bg-primary" />Fieldwork® — Signal lab</span><span className="text-secondary-foreground/60">VISUAL EXPERIMENT / 003</span>
      </header>
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-80 overflow-hidden md:min-h-[480px]">
          <div className="absolute inset-0"><Interference frequency={frequency} /></div>
          <div className="absolute inset-0 bg-linear-to-t from-secondary via-transparent to-transparent" />
          <span className="absolute left-6 top-6 font-mono text-[10px] tracking-[.2em] text-primary">◌ INTERFERENCE FIELD</span>
          <div className="absolute bottom-7 left-6 right-6"><p className="mb-2 font-mono text-xs text-primary">{station.band}</p><h3 className="text-3xl font-light tracking-tight">{station.name}</h3><p className="mt-2 text-sm text-secondary-foreground/65">{station.description}</p></div>
        </div>
        <div className="flex flex-col justify-center gap-7 p-6 sm:p-9">
          <div><p className="mb-3 font-mono text-[10px] uppercase tracking-[.25em] text-secondary-foreground/60">Tune out. Tune in.</p><h2 className="text-4xl font-light leading-tight tracking-tight">{title}</h2><p className="mt-4 text-sm leading-6 text-secondary-foreground/65">Explore a little space between the noise. Turn the dial and watch a new signal take shape.</p></div>
          <SignalDial value={frequency} onValueChange={setFrequency} />
          <div className="flex flex-wrap gap-2" aria-label="Frequency presets">{stations.map((preset, index) => <button key={preset.name} type="button" aria-pressed={frequency === preset.value} onClick={() => setFrequency(preset.value)} className="border border-secondary-foreground/20 px-3 py-2 font-mono text-xs transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary">0{index + 1} / {preset.name}</button>)}</div>

        </div>
      </div>
    </section>
  );
}
