"use client";

import { useId, useState, ViewTransition, type FormEvent } from "react";

export function Auth3({ brand = "Northstar Studio", className = "" }: { brand?: string; className?: string }) {
  const [created, setCreated] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreated(true);
  }

  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><section aria-label="Auth 3: create account" className={`grid w-full border border-border bg-background text-foreground lg:grid-cols-[.72fr_1.28fr] ${className}`}>
    <aside className="flex flex-col justify-between gap-10 bg-secondary p-7 text-secondary-foreground sm:p-10"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-primary">A good place to begin</p><p className="mt-4 text-xl font-semibold tracking-tight">{brand}</p></div><div><p className="font-serif text-3xl leading-tight">Make room for the work you want to do.</p><ul className="mt-7 space-y-4 text-sm text-secondary-foreground/70"><li className="flex gap-3"><span className="font-mono text-primary">01</span> Keep your projects together</li><li className="flex gap-3"><span className="font-mono text-primary">02</span> Pick up where you left off</li><li className="flex gap-3"><span className="font-mono text-primary">03</span> Invite your collaborators</li></ul></div><span className="font-mono text-[9px] uppercase tracking-[.18em] text-secondary-foreground/50">CREATE ACCOUNT / 03</span></aside>
    <div className="p-6 sm:p-10"><div className="flex items-center justify-between gap-3"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">Start your workspace</p><span className="font-mono text-[10px] text-muted-foreground">STEP 1 OF 1</span></div><h2 className="mt-3 text-3xl font-light tracking-tight">Create your account.</h2><p className="mt-2 text-sm text-muted-foreground">A few details and you&apos;re ready to go.</p>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        <div className="space-y-2"><label htmlFor={nameId} className="text-sm">Full name</label><input id={nameId} name="name" autoComplete="name" required placeholder="Alex Morgan" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/30" /></div>
        <div className="space-y-2"><label htmlFor={emailId} className="text-sm">Work email</label><input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/30" /></div>
        <div className="space-y-2"><label htmlFor={passwordId} className="text-sm">Create a password</label><input id={passwordId} name="password" type="password" autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/30" /></div>
        <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input required type="checkbox" className="mt-1 accent-primary" />I agree to the terms of service and privacy policy.</label>
        <button type="submit" className="w-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Create account <span aria-hidden="true">→</span></button>
      </form><p aria-live="polite" className="mt-4 min-h-5 text-sm text-primary">{created ? "Demo submitted. Connect your auth provider to create an account." : "Already have an account? Sign in →"}</p>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">UI example only. No account or credentials are created.</p>
    </div>
  </section></ViewTransition>;
}
