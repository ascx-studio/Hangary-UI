import { ArrowUpRight } from "lucide-react";
import { ViewTransition } from "react";

const links = [
  { label: "About", href: "#studio" },
  { label: "Selected work", href: "#work" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export function StudioFooter({ brand = "LAZY UI", className = "" }: { brand?: string; className?: string }) {
  return (
    <ViewTransition enter="morph-enter" exit="morph-exit" default="none">
      <footer className={`w-full overflow-hidden bg-[#111b18] px-6 pt-10 text-[#f3f9e9] sm:px-10 lg:px-14 ${className}`}>
        <div className="grid gap-10 border-b border-white/20 pb-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(12rem,.5fr)_minmax(15rem,.7fr)] lg:gap-12">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[.24em] text-[#d5ff55]">Next chapter / Start here</span>
            <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-[1.02] tracking-[-.06em] sm:text-5xl">Let&apos;s make something matter.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#b9cbb6]">Thoughtful interfaces for people building what comes next.</p>
          </div>
          <nav aria-label="Footer navigation">
            <h3 className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[.23em] text-[#9caf9b]">Explore</h3>
            <ul className="space-y-3">{links.map(link => <li key={link.href}><a href={link.href} className="text-sm hover:text-[#d5ff55] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5ff55]">{link.label}</a></li>)}</ul>
          </nav>
          <div>
            <h3 className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[.23em] text-[#9caf9b]">Have a project in mind?</h3>
            <a href="mailto:hello@example.com" className="inline-flex items-center gap-2 border-b border-[#d5ff55] pb-2 text-lg font-medium text-[#d5ff55] hover:text-[#ecffac] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5ff55]">hello@example.com <ArrowUpRight size={18} aria-hidden="true" /></a>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-[#9caf9b]">Open for ambitious collaborations.</p>
          </div>
        </div>
        <div className="overflow-hidden border-b border-white/20 py-5" aria-hidden="true"><span className="block whitespace-nowrap text-[clamp(4rem,12vw,12rem)] font-black leading-none tracking-[-.09em] text-[#d5ff55]">{brand}</span></div>
        <div className="flex flex-wrap items-center justify-between gap-3 py-5 font-mono text-[10px] uppercase tracking-[.14em] text-[#9caf9b]">
          <span>© {new Date().getFullYear()} {brand}. All rights reserved.</span>
          <a href="#top" className="hover:text-[#d5ff55] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5ff55]">Back to top ↑</a>
        </div>
      </footer>
    </ViewTransition>
  );
}
