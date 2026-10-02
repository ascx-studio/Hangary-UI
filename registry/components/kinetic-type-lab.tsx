"use client";

import { useId, useState, type CSSProperties } from "react";
import "./kinetic-type-lab.css";

const presets = [
  { label: "Pulse", text: "MAKE WAVES", amplitude: 24, speed: 1.8, tracking: -0.07 },
  { label: "Drift", text: "STAY CURIOUS", amplitude: 13, speed: 3.2, tracking: -0.04 },
  { label: "Surge", text: "FEEL MORE", amplitude: 38, speed: 1.15, tracking: -0.09 },
] as const;

export function KineticTypeLab({ className = "" }: { className?: string }) {
  const [text, setText] = useState<string>(presets[0].text);
  const [amplitude, setAmplitude] = useState<number>(presets[0].amplitude);
  const [speed, setSpeed] = useState<number>(presets[0].speed);
  const [tracking, setTracking] = useState<number>(presets[0].tracking);
  const [playing, setPlaying] = useState(true);
  const inputId = useId();
  const displayText = text.trim() || "MAKE WAVES";
  const letters = Array.from(displayText);
  const stageStyle = {
    "--wave-height": `${amplitude}px`,
    "--wave-speed": `${speed}s`,
    "--wave-tracking": `${tracking}em`,
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
          <span>Move the controls ↓</span><span>01 / 03</span>
        </div>
      </div>

      <div className="grid gap-6 bg-[#f1f4e9] p-5 text-[#17211c] sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,.8fr)] lg:gap-10">
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#58685d]">The message</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Give it a pulse.</h2></div>
            <button type="button" aria-pressed={!playing} onClick={() => setPlaying(value => !value)} className="border border-[#17211c]/25 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-[#d5ff55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17211c]">{playing ? "Pause motion" : "Play motion"}</button>
          </div>
          <label htmlFor={inputId} className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[.18em]">Your words</label>
          <input id={inputId} value={text} maxLength={18} onChange={event => setText(event.target.value)} className="w-full border-b-2 border-[#17211c] bg-transparent py-2 text-xl font-semibold tracking-tight outline-none placeholder:text-[#778879] focus:border-[#729d12]" placeholder="Type a message" />
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Type presets">
            {presets.map(preset => <button key={preset.label} type="button" onClick={() => { setText(preset.text); setAmplitude(preset.amplitude); setSpeed(preset.speed); setTracking(preset.tracking); setPlaying(true); }} className="border border-[#17211c]/20 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest hover:border-[#17211c] hover:bg-[#d5ff55] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17211c]">{preset.label} ↗</button>)}
          </div>
        </div>
        <div className="grid gap-4 border-t border-[#17211c]/20 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <label className="block"><span className="mb-2 flex justify-between font-mono text-[10px] font-semibold uppercase tracking-widest"><span>Energy</span><output>{amplitude}</output></span><input aria-label="Energy" type="range" min="0" max="48" value={amplitude} onChange={event => setAmplitude(Number(event.target.value))} className="ktl-range w-full" /></label>
          <label className="block"><span className="mb-2 flex justify-between font-mono text-[10px] font-semibold uppercase tracking-widest"><span>Tempo</span><output>{speed.toFixed(1)}s</output></span><input aria-label="Tempo" type="range" min="0.8" max="4" step="0.1" value={speed} onChange={event => setSpeed(Number(event.target.value))} className="ktl-range w-full" /></label>
          <label className="block"><span className="mb-2 flex justify-between font-mono text-[10px] font-semibold uppercase tracking-widest"><span>Spacing</span><output>{tracking.toFixed(2)}em</output></span><input aria-label="Spacing" type="range" min="-0.1" max="0.08" step="0.01" value={tracking} onChange={event => setTracking(Number(event.target.value))} className="ktl-range w-full" /></label>
        </div>
      </div>
    </section>
  );
}
