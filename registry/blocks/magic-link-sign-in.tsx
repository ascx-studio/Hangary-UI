"use client";

import { useId, useState, ViewTransition, type FormEvent } from "react";

export function MagicLinkSignIn({ brand = "FIELD NOTES", className = "" }: { brand?: string; className?: string }) {
  const [sent, setSent] = useState(false);
  const emailId = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><section aria-label="Magic link sign in" className={`mx-auto w-full max-w-3xl border border-border bg-card text-card-foreground sm:grid sm:grid-cols-[.8fr_1.2fr] ${className}`}>
    <aside className="flex flex-col justify-between gap-12 bg-muted p-7 sm:p-9"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-primary">A quieter sign-in</p><p className="mt-4 text-lg font-semibold tracking-wide">{brand}</p></div><div><div aria-hidden="true" className="flex size-14 items-center justify-center border border-border font-serif text-2xl text-primary">@</div><p className="mt-5 max-w-xs font-serif text-3xl leading-tight">No password to remember. No fuss.</p></div><span className="font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">EMAIL LINK</span></aside>
    <div className="flex flex-col justify-center p-7 sm:p-10"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">Passwordless access</p><h2 className="mt-3 text-3xl font-light tracking-tight">Get a sign-in link.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Enter your email and we&apos;ll send you a secure, one-time link to open your workspace.</p>
      <form className="mt-7 space-y-4" onSubmit={submit}><div className="space-y-2"><label htmlFor={emailId} className="text-sm">Email address</label><input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/30" /></div><button type="submit" className="w-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Email me a sign-in link <span aria-hidden="true">↗</span></button></form>
      <p aria-live="polite" className="mt-4 min-h-10 text-sm leading-5 text-primary">{sent ? "If an account exists for that address, a sign-in link is on its way." : "Check your inbox after requesting a link. It expires after a short time."}</p><a href="#password-sign-in" className="mt-3 text-xs text-primary underline-offset-4 hover:underline">Prefer a password? Sign in</a>
    </div>
  </section></ViewTransition>;
}
