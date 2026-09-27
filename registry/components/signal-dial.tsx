"use client";

import { useId, useState } from "react";

export type SignalDialProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  label?: string;
};

/** A native, keyboard-accessible range dressed as an analog tuning instrument. */
export function SignalDial({ value, defaultValue = 42, onValueChange, label = "Frequency" }: SignalDialProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue);
  const raw = value ?? internal;
  const level = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 0;

  return (
    <div className="w-full  border border-border bg-secondary p-5 text-secondary-foreground">
      <div className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="text-primary">{(88 + level * 0.2).toFixed(1)} MHz</output>
      </div>
      <div aria-hidden="true" className="relative my-6 h-16 overflow-hidden border-y border-secondary-foreground/10">
        <div className="absolute inset-0 flex items-end justify-between">
          {Array.from({ length: 41 }, (_, index) => <span key={index} className={`${index % 5 === 0 ? "h-9 bg-secondary-foreground/40" : "h-4 bg-secondary-foreground/20"} w-px`} />)}
        </div>
        <div className="absolute bottom-0 top-0 w-0.5 bg-primary shadow-md shadow-primary/40" style={{ left: `calc(${level}% - ${level / 100}px)` }} />
      </div>
      <input id={id} type="range" min={0} max={100} step={1} value={level} aria-valuetext={`${(88 + level * 0.2).toFixed(1)} megahertz`} onChange={(event) => {
        const next = Number(event.target.value);
        setInternal(next);
        onValueChange?.(next);
      }} className="block h-6 w-full cursor-ew-resize accent-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" />
      <div aria-hidden="true" className="mt-2 flex justify-between font-mono text-[10px] text-secondary-foreground/60"><span>88.0</span><span>FM / MANUAL TUNING</span><span>108.0</span></div>
    </div>
  );
}
