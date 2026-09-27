"use client";

import { useState } from "react";
import Link from "next/link";
import { DaylightAtlas } from "../blocks/daylight-atlas";
import { OrbitSelector } from "../components/orbit-selector";
import { SecretTicket } from "../components/secret-ticket";

const fieldNotes = [
  { code: "OBS-01", title: "Look up", text: "Light takes eight minutes to reach us. The present is always a little further away than it appears." },
  { code: "OBS-02", title: "Stay awhile", text: "The sky does not hurry through its colors. Neither do you have to." },
  { code: "OBS-03", title: "Mark the moment", text: "Pick a time, give it a name, and keep a small piece of the day." },
];

/** A complete observatory landing page, assembled from the atlas and orbit components. */
export function Daybreak({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState("Explore");
  return (
    <main className={`w-full overflow-hidden bg-[#0b0e16] text-[#edf0fa] ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-10">
        <Link href="#daybreak-home" className="font-mono text-sm font-semibold uppercase tracking-[.22em] focus-visible:outline-2">NIGHT / SCHOOL</Link>
        <nav aria-label="Daybreak navigation" className="flex gap-5 font-mono text-[10px] uppercase tracking-widest text-white/60"><Link href="#observatory" className="hover:text-white">Observatory</Link><Link href="#field-guide" className="hover:text-white">Field guide</Link><Link href="#dispatch" className="hover:text-white">Dispatch</Link></nav>
      </header>
      <section id="daybreak-home" className="relative grid min-h-[420px] items-end overflow-hidden px-6 py-14 sm:px-10 sm:py-20 lg:min-h-[500px] lg:grid-cols-[1fr_.7fr]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_55%,#39497a_0%,#171d36_28%,#0b0e16_68%)]" />
        <div aria-hidden="true" className="absolute right-[14%] top-[17%] size-40 border border-[#d9d5ff]/25 bg-[#d9d5ff]/10 shadow-[0_0_100px_#aaa5ff44] sm:size-56" />
        <div className="relative max-w-3xl"><p className="font-mono text-[10px] uppercase tracking-[.28em] text-[#c7c2ff]">An observatory for ordinary days</p><h1 className="mt-6 text-6xl font-light leading-[.96] tracking-[-.06em] sm:text-8xl">The sky<br />keeps <span className="text-[#b9b4ee]">changing.</span></h1></div>
        <div className="relative mt-8 max-w-sm lg:ml-auto"><p className="text-base leading-7 text-white/65">A field guide to the colors, moods, and small rituals hidden in the hours between sunrise and sleep.</p><Link href="#observatory" className="mt-6 inline-flex border border-[#c7c2ff]/60 px-5 py-3 font-mono text-xs uppercase tracking-wider text-[#d8d5ff] hover:bg-[#c7c2ff]/10 focus-visible:outline-2 focus-visible:outline-offset-4">Enter the observatory ↓</Link></div>
      </section>
      <section id="observatory" className="scroll-mt-6 px-3 pb-14 sm:px-6 sm:pb-20"><div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-3 sm:px-5"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-white/40">Live instrument / {mode}</p><h2 className="mt-2 text-3xl font-light tracking-tight">Daylight atlas</h2></div><span className="font-mono text-xs text-white/40">51°30′N / 00°07′W</span></div><DaylightAtlas /></section>
      <section id="field-guide" className="scroll-mt-6 border-y border-white/10 bg-[#10131d] px-6 py-14 sm:px-10 sm:py-20"><div className="grid gap-10 lg:grid-cols-[.65fr_1fr]"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#c7c2ff]">Choose your pace</p><h2 className="mt-4 max-w-sm text-4xl font-light leading-tight tracking-tight">There&apos;s no wrong way to look up.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-white/55">A little intention can change the shape of an hour. Pick the orbit that feels right.</p></div><OrbitSelector onModeChange={setMode} /></div></section>
      <section id="dispatch" className="scroll-mt-6 px-6 py-14 sm:px-10 sm:py-20"><div className="mb-8"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#c7c2ff]">Notebook / 03 entries</p><h2 className="mt-3 text-3xl font-light">Field observations</h2></div><div className="grid gap-6 md:grid-cols-3">{fieldNotes.map(note => <article key={note.code} className="border-t border-white/20 pt-5"><span className="font-mono text-[10px] tracking-widest text-white/40">{note.code}</span><h3 className="mt-5 text-xl">{note.title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{note.text}</p></article>)}</div></section>
      <section className="grid gap-10 border-t border-white/10 bg-[#131522] px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-2 lg:items-center"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#c7c2ff]">Your next little ritual</p><h2 className="mt-4 text-4xl font-light tracking-tight">Take the night with you.</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/55">Keep a reminder from the observatory. Break the seal when you&apos;re ready to go a little further.</p></div><SecretTicket title="The afterglow walk" code="LOOK-UP-AGAIN" detail="A small invitation to find the sky after dark." /></section>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-white/10 px-6 py-5 font-mono text-[10px] uppercase tracking-widest text-white/40 sm:px-10"><span>Night / School observatory</span><span>Keep looking up.</span></footer>
    </main>
  );
}
