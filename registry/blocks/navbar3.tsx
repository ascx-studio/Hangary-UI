"use client";

import { useId, useState, ViewTransition, startTransition } from "react";
import Image from "next/image";

export function Navbar3() {
  const [menuOpen, setMenuOpen] = useState(false);
  const id = useId();
  const links = ["Stories", "Culture", "Field notes", "Archive"];
  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><header className="w-full border border-border bg-background text-foreground">
    <div className="flex items-center justify-between border-b border-border px-5 py-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground"><span>Volume 04 · Issue 12</span><a href="#newsletter" className="hover:text-foreground">The Sunday letter ↗</a></div>
    <div className="px-5 pt-5 text-center sm:px-8 sm:pt-7"><a href="#nav-home" aria-label="Lazy UI journal home" className="inline-flex flex-col items-center focus-visible:outline-2"><Image src="/logo.png" alt="" width={46} height={46} className="size-11 object-contain" /><span className="mt-2 font-serif text-2xl font-semibold tracking-[.12em] sm:text-3xl">LAZY UI</span><span className="mt-1 font-mono text-[9px] uppercase tracking-[.32em] text-muted-foreground">A journal for the curious</span></a></div>
    <nav aria-label="Journal navigation" className="px-5 pb-4 pt-5 sm:px-8"><button type="button" aria-expanded={menuOpen} aria-controls={id} onClick={() => startTransition(() => setMenuOpen(!menuOpen))} className="mx-auto block border border-border px-3 py-2 text-xs md:hidden focus-visible:outline-2 focus-visible:outline-ring">{menuOpen ? "Close −" : "Explore +"}</button>
      <ul id={id} className={`${menuOpen ? "flex" : "hidden"} flex-col items-center gap-1 border-t border-border pt-3 md:flex md:flex-row md:justify-center md:gap-9 md:border-0 md:pt-0`}>{links.map((link, index) => <li key={link}><a href={`#journal-${index}`} onClick={() => startTransition(() => setMenuOpen(false))} className="block px-2 py-2 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground hover:text-foreground focus-visible:outline-2">{link}</a></li>)}</ul>
    </nav>
  </header></ViewTransition>;
}
