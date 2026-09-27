"use client";

import { useState } from "react";

const modes = [
  { name: "Explore", angle: -90, color: "var(--primary)", description: "Follow a thought somewhere unexpected.", coordinate: "01 / OPEN HORIZON" },
  { name: "Focus", angle: 30, color: "var(--info)", description: "One thing. Your complete attention.", coordinate: "02 / DEEP WORK" },
  { name: "Unwind", angle: 150, color: "var(--warning)", description: "Let the day settle into the background.", coordinate: "03 / SLOW ORBIT" },
];

export function OrbitSelector({ onModeChange }: { onModeChange?: (mode: string) => void }) {
  const [selected, setSelected] = useState(0);
  const mode = modes[selected];
  return (
    <section aria-label="Orbit mode selector" className="mx-auto w-full max-w-md overflow-hidden border border-border bg-secondary p-6 text-secondary-foreground sm:p-8">
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[.2em] text-secondary-foreground/60"><span>Orbital / interface</span><span>◎ System ready</span></div>
      <div className="relative mx-auto my-8 aspect-square w-full max-w-72">
        <div aria-hidden="true" className="absolute inset-[12%] rounded-full border border-secondary-foreground/15" />
        <div aria-hidden="true" className="absolute inset-[25%] rounded-full border border-dashed border-secondary-foreground/10" />
        <div aria-hidden="true" className="absolute inset-[35%] rounded-full shadow-lg transition-colors duration-500 motion-reduce:transition-none" style={{ background: mode.color, boxShadow: "var(--shadow-lg)" }} />
        {modes.map((item, index) => {
          const radians = item.angle * Math.PI / 180;
          return <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => { setSelected(index); onModeChange?.(item.name); }} className="absolute -translate-x-1/2 -translate-y-1/2 border px-3 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" style={{ left: `${50 + Math.cos(radians) * 38}%`, top: `${50 + Math.sin(radians) * 38}%`, borderColor: selected === index ? item.color : "var(--border)", background: selected === index ? item.color : "var(--card)", color: "var(--foreground)" }}>{item.name}</button>;
        })}
      </div>
      <div aria-live="polite" className="border-t border-secondary-foreground/10 pt-5"><p className="font-mono text-[10px] tracking-widest" style={{ color: mode.color }}>{mode.coordinate}</p><h3 className="mt-2 text-3xl font-light">{mode.name} mode</h3><p className="mt-3 min-h-10 text-sm text-secondary-foreground/60">{mode.description}</p></div>
    </section>
  );
}
