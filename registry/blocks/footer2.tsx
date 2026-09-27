import { ArrowUpRight } from "lucide-react";
import { ViewTransition } from "react";

const links = ["About", "Selected work", "Journal", "Contact"];

export function Footer2({ brand = "LAZY UI", className = "" }: { brand?: string; className?: string }) {
  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><footer className={`w-full border border-border bg-secondary px-6 py-8 text-secondary-foreground sm:px-10 sm:py-10 ${className}`}>
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_.9fr] lg:gap-12">
      <div className="flex min-h-40 flex-col justify-between">
        <a href="#footer-home" className="w-fit font-mono text-xl font-semibold tracking-[.12em] focus-visible:outline-2 focus-visible:outline-ring">{brand}<span className="ml-2 text-primary">®</span></a>
        <p className="mt-8 max-w-xs text-sm leading-6 text-secondary-foreground/65">Thoughtful interfaces for people building what comes next.</p>
      </div>
      <nav aria-label="Footer navigation">
        <h2 className="font-mono text-[10px] uppercase tracking-[.18em] text-secondary-foreground/50">Explore</h2>
        <ul className="mt-4 space-y-3">{links.map((link, index) => <li key={link}><a href={`#footer-${index}`} className="text-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">{link}</a></li>)}</ul>
      </nav>
      <div>
        <h2 className="font-mono text-[10px] uppercase tracking-[.18em] text-secondary-foreground/50">Have a project in mind?</h2>
        <a href="mailto:hello@example.com" className="mt-4 inline-flex items-center gap-2 text-sm underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">hello@example.com <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
    </div>
    <div className="mt-9 flex flex-col gap-3 border-t border-secondary-foreground/15 pt-4 font-mono text-[9px] uppercase tracking-[.14em] text-secondary-foreground/50 sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} {brand}. All rights reserved.</p>
      <a href="#footer-home" className="w-fit hover:text-secondary-foreground focus-visible:outline-2 focus-visible:outline-ring">Back to top ↑</a>
    </div>
  </footer></ViewTransition>;
}
