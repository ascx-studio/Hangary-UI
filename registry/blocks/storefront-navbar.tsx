"use client";

import { useId, useState, ViewTransition, startTransition } from "react";
import Image from "next/image";

export function StorefrontNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const id = useId();
  const links = ["Furniture", "Lighting", "Objects", "Journal"];
  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><header className="w-full border border-border bg-card text-card-foreground">
    <div className="bg-secondary px-4 py-2 text-center font-mono text-[9px] uppercase tracking-[.16em] text-secondary-foreground">Complimentary shipping on orders over $150</div>
    <nav aria-label="Shop navigation" className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-5 sm:grid-cols-[1fr_auto_1fr] sm:px-8">
      <a href="#nav-home" aria-label="Lazy UI shop home" className="flex items-center gap-3 focus-visible:outline-2"><Image src="/logo.png" alt="" width={44} height={44} className="size-11 object-contain" /><span><span className="block font-serif text-lg font-semibold leading-none">Lazy UI</span><span className="mt-1 block font-mono text-[8px] uppercase tracking-[.2em] text-muted-foreground">Objects for living</span></span></a>
      <button type="button" aria-expanded={menuOpen} aria-controls={id} onClick={() => startTransition(() => setMenuOpen(!menuOpen))} className="justify-self-end border border-border px-3 py-2 text-xs sm:hidden">{menuOpen ? "Close −" : "Menu +"}</button>
      <div className="hidden justify-self-center sm:block"><label htmlFor={`${id}-search`} className="sr-only">Search the collection</label><input id={`${id}-search`} type="search" placeholder="Search the collection" className="w-48 border-b border-border bg-transparent px-2 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring lg:w-64" /></div>
      <a href="#bag" className="hidden justify-self-end border-b border-border pb-1 font-mono text-[10px] uppercase tracking-wider sm:block">Bag <span className="ml-2 text-muted-foreground">(0)</span></a>
      <ul id={id} className={`${menuOpen ? "flex" : "hidden"} col-span-2 flex-col border-t border-border pt-3 sm:col-span-3 sm:flex sm:flex-row sm:justify-center sm:gap-10 sm:pt-4`}>{links.map((link, index) => <li key={link}><a href={`#shop-${index}`} onClick={() => startTransition(() => setMenuOpen(false))} className="block py-2 font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground hover:text-foreground focus-visible:outline-2">{link}</a></li>)}</ul>
    </nav>
  </header></ViewTransition>;
}
