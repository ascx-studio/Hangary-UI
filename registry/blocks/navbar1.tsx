"use client";

import { useId, useState, ViewTransition } from "react";
import Image from "next/image";

const links = [{ label: "Work", href: "#work" }, { label: "Studio", href: "#studio" }, { label: "Journal", href: "#journal" }];

export function Navbar1({ brand = "Lazy UI", className = "" }: { brand?: string; className?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><header className={`w-full border border-border bg-card text-card-foreground ${className}`}>
    <nav aria-label="Main navigation" className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
      <a href="#top" aria-label={`${brand} home`} className="flex items-center gap-3 font-mono text-sm font-semibold tracking-[.12em] focus-visible:outline-2"><span className="flex size-10 items-center justify-center bg-secondary p-1"><Image src="/logo.png" alt="" width={40} height={40} className="size-9 object-contain" /></span>{brand}</a>
      <button type="button" aria-expanded={menuOpen} aria-controls={menuId} onClick={() => setMenuOpen(!menuOpen)} className="border border-border px-3 py-2 text-xs md:hidden focus-visible:outline-2 focus-visible:outline-ring">{menuOpen ? "Close −" : "Menu +"}</button>
      <ul id={menuId} className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-1 border-t border-border pt-3 md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:pt-0`}>
        {links.map(link => <li key={link.href}><a href={link.href} onClick={() => setMenuOpen(false)} className="block px-2 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground focus-visible:outline-2">{link.label}</a></li>)}
        <li><a href="#contact" onClick={() => setMenuOpen(false)} className="inline-flex bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Let&apos;s talk ↗</a></li>
      </ul>
    </nav>
  </header></ViewTransition>;
}
