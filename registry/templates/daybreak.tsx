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
    <main className={`w-full overflow-hidden bg-background text-foreground ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-10">
        <Link href="#daybreak-home" className="font-mono text-sm font-semibold uppercase tracking-[.22em] focus-visible:outline-2">NIGHT / SCHOOL</Link>
        <nav aria-label="Daybreak navigation" className="flex gap-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><Link href="#observatory" className="hover:text-foreground">Observatory</Link><Link href="#field-guide" className="hover:text-foreground">Field guide</Link><Link href="#dispatch" className="hover:text-foreground">Dispatch</Link></nav>
      </header>
      <section id="daybreak-home" className="relative grid min-h-[420px] items-end overflow-hidden px-6 py-14 sm:px-10 sm:py-20 lg:min-h-[500px] lg:grid-cols-[1fr_.7fr]">
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-br from-primary/20 via-muted to-background" />
        <div aria-hidden="true" className="absolute right-[14%] top-[17%] size-40 border border-primary/25 bg-primary/10 shadow-lg shadow-primary/10 sm:size-56" />
        <div className="relative max-w-3xl"><p className="font-mono text-[10px] uppercase tracking-[.28em] text-primary">An observatory for ordinary days</p><h1 className="mt-6 text-6xl font-light leading-[.96] tracking-[-.06em] sm:text-8xl">The sky<br />keeps <span className="text-primary">changing.</span></h1></div>
        <div className="relative mt-8 max-w-sm lg:ml-auto"><p className="text-base leading-7 text-muted-foreground">A field guide to the colors, moods, and small rituals hidden in the hours between sunrise and sleep.</p><Link href="#observatory" className="mt-6 inline-flex border border-primary/60 px-5 py-3 font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Enter the observatory ↓</Link></div>
      </section>
      <section id="observatory" className="scroll-mt-6 px-3 pb-14 sm:px-6 sm:pb-20"><div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-3 sm:px-5"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-muted-foreground">Live instrument / {mode}</p><h2 className="mt-2 text-3xl font-light tracking-tight">Daylight atlas</h2></div><span className="font-mono text-xs text-muted-foreground">51°30′N / 00°07′W</span></div><DaylightAtlas /></section>
      <section id="field-guide" className="scroll-mt-6 border-y border-border bg-muted px-6 py-14 sm:px-10 sm:py-20"><div className="grid gap-10 lg:grid-cols-[.65fr_1fr]"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-primary">Choose your pace</p><h2 className="mt-4 max-w-sm text-4xl font-light leading-tight tracking-tight">There&apos;s no wrong way to look up.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">A little intention can change the shape of an hour. Pick the orbit that feels right.</p></div><OrbitSelector onModeChange={setMode} /></div></section>
      <section id="dispatch" className="scroll-mt-6 px-6 py-14 sm:px-10 sm:py-20"><div className="mb-8"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-primary">Notebook / 03 entries</p><h2 className="mt-3 text-3xl font-light">Field observations</h2></div><div className="grid gap-6 md:grid-cols-3">{fieldNotes.map(note => <article key={note.code} className="border-t border-border pt-5"><span className="font-mono text-[10px] tracking-widest text-muted-foreground">{note.code}</span><h3 className="mt-5 text-xl">{note.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{note.text}</p></article>)}</div></section>
      <section className="grid gap-10 border-t border-border bg-card px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-2 lg:items-center"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-primary">Your next little ritual</p><h2 className="mt-4 text-4xl font-light tracking-tight">Take the night with you.</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Keep a reminder from the observatory. Break the seal when you&apos;re ready to go a little further.</p></div><SecretTicket title="The afterglow walk" code="LOOK-UP-AGAIN" detail="A small invitation to find the sky after dark." /></section>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border px-6 py-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:px-10"><span>Night / School observatory</span><span>Keep looking up.</span></footer>
    </main>
  );
}
