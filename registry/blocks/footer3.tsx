"use client";

import { useState, type FormEvent } from "react";
import { ViewTransition } from "react";

export function Footer3({ className = "" }: { className?: string }) {
  const [joined, setJoined] = useState(false);
  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJoined(true);
  }

  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><footer className={`w-full border border-border bg-muted px-6 py-8 text-foreground sm:px-10 sm:py-10 ${className}`}>
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(16rem,.7fr)] lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">A letter for slower Sundays</p><h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">Ideas worth keeping, sent occasionally.</h2></div><form onSubmit={subscribe} className="flex border-b border-border pb-2"><label htmlFor="footer-newsletter-email" className="sr-only">Email address</label><input required id="footer-newsletter-email" type="email" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /><button type="submit" className="px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-primary hover:text-primary/80 focus-visible:outline-2">{joined ? "Joined ✓" : "Subscribe ↗"}</button></form></div>
    <div className="mt-9 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><nav aria-label="Journal footer links" className="flex flex-wrap gap-x-5 gap-y-2">{["Instagram", "Masthead", "Archive", "Contact"].map((link, index) => <a key={link} href={`#journal-footer-${index}`} className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-2">{link}</a>)}</nav><p aria-live="polite" className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{joined ? "Thanks for joining us." : `© ${new Date().getFullYear()} The Sunday Letter`}</p></div>
  </footer></ViewTransition>;
}
