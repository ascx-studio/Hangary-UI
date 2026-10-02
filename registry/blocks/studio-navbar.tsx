"use client";

import { useId, useState, ViewTransition, startTransition } from "react";
import Image from "next/image";

export function StudioNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const id = useId();
  const links = ["Services", "Selected work", "Studio notes"];
  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><header className="w-full border border-border bg-background text-foreground">
    <div className="flex items-center justify-center bg-secondary px-3 py-2 text-center font-mono text-[9px] uppercase tracking-[.16em] text-secondary-foreground sm:text-[10px]">Independent digital studio · Working worldwide</div>
    <nav aria-label="Studio navigation" className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
      <a href="#nav-home" aria-label="Lazy UI studio home" className="flex items-center gap-3 focus-visible:outline-2"><Image src="/logo.png" alt="" width={40} height={40} className="size-10 object-contain" /><span><span className="block text-sm font-semibold tracking-tight">Lazy UI</span><span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">Design studio</span></span></a>
      <button type="button" aria-expanded={menuOpen} aria-controls={id} onClick={() => startTransition(() => setMenuOpen(!menuOpen))} className="border border-border px-3 py-2 text-xs md:hidden focus-visible:outline-2 focus-visible:outline-ring">{menuOpen ? "Close −" : "Menu +"}</button>
      <ul id={id} className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-1 border-t border-border pt-3 md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:pt-0`}>{links.map((link, index) => <li key={link}><a href={`#studio-${index}`} onClick={() => startTransition(() => setMenuOpen(false))} className="block py-2 text-sm text-muted-foreground underline-offset-8 decoration-primary hover:text-foreground hover:underline focus-visible:outline-2">{link}</a></li>)}<li><a href="#nav-action" className="inline-flex bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring">Start a project <span className="ml-3" aria-hidden="true">↗</span></a></li></ul>
    </nav>
  </header></ViewTransition>;
}
