"use client";

import { useId, useState } from "react";

const links = [{ label: "Work", href: "#work" }, { label: "Studio", href: "#studio" }, { label: "Journal", href: "#journal" }];

export function NavbarBlock({ brand = "FORM / FIELD", className = "" }: { brand?: string; className?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  return <header className={`w-full border border-[#26352d]/20 bg-[#e9eee7] text-[#26352d] ${className}`}>
    <nav aria-label="Main navigation" className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
      <a href="#top" className="font-mono text-sm font-semibold tracking-[.18em] focus-visible:outline-2">{brand}</a>
      <button type="button" aria-expanded={menuOpen} aria-controls={menuId} onClick={() => setMenuOpen(!menuOpen)} className="border border-[#26352d]/30 px-3 py-2 text-xs md:hidden focus-visible:outline-2">{menuOpen ? "Close −" : "Menu +"}</button>
      <ul id={menuId} className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-1 border-t border-[#26352d]/15 pt-3 md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:pt-0`}>
        {links.map(link => <li key={link.href}><a href={link.href} onClick={() => setMenuOpen(false)} className="block px-2 py-2 font-mono text-xs uppercase tracking-widest text-[#53645a] hover:text-[#14231b] focus-visible:outline-2">{link.label}</a></li>)}
        <li><a href="#contact" onClick={() => setMenuOpen(false)} className="inline-flex bg-[#26352d] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#3a5043] focus-visible:outline-2 focus-visible:outline-offset-2">Let&apos;s talk ↗</a></li>
      </ul>
    </nav>
  </header>;
}
