"use client";

import { useId, useState, ViewTransition, type FormEvent } from "react";

export function Auth1({ brand = "Northstar", className = "" }: { brand?: string; className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none">
    <section aria-label="Auth 1: Northstar sign in" className={`grid w-full border border-border bg-secondary text-secondary-foreground md:grid-cols-2 ${className}`}>
      <div className="flex min-h-72 flex-col justify-between bg-muted p-7 text-foreground sm:p-10">
        <span className="font-mono text-xs font-semibold uppercase tracking-[.2em]">{brand} / MEMBERS</span>
        <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">A quieter kind of workspace</p><h2 className="mt-3 max-w-sm text-4xl font-light leading-tight tracking-tight">Good to see you again.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Sign in to pick up right where your best ideas left off.</p></div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">EST. 2024 — BUILT FOR FOCUS</span>
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">Member access</p><h3 className="mt-2 text-2xl font-medium">Sign in</h3><p className="mt-2 text-sm text-secondary-foreground/70">Use your email to continue.</p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          <div className="space-y-2"><label htmlFor={emailId} className="text-sm">Email address</label><input required autoComplete="email" id={emailId} name="email" type="email" placeholder="you@example.com" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus-visible:ring-2 focus-visible:ring-ring" /></div>
          <div className="space-y-2"><div className="flex justify-between gap-2"><label htmlFor={passwordId} className="text-sm">Password</label><a href="#reset-password" className="text-xs text-primary underline-offset-4 hover:underline">Forgot password?</a></div><input required autoComplete="current-password" minLength={8} id={passwordId} name="password" type="password" placeholder="8 characters minimum" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus-visible:ring-2 focus-visible:ring-ring" /></div>
          <button type="submit" className="w-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Continue <span aria-hidden="true">→</span></button>
        </form>
        <p aria-live="polite" className="mt-4 min-h-5 text-sm text-primary">{submitted ? "Demo form submitted. Connect your auth provider to sign in." : "New here? Create an account →"}</p>
      </div>
    </section>
  </ViewTransition>;
}
