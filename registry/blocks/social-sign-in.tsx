"use client";

import { useId, useState, ViewTransition, type FormEvent } from "react";
import Image from "next/image";

export function SocialSignIn({ brand = "COMMON GROUND", className = "" }: { brand?: string; className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none">
    <section aria-label="Social sign in" className={`mx-auto w-full max-w-lg border border-border bg-card px-6 py-7 text-card-foreground sm:px-10 sm:py-9 ${className}`}>
      <header className="flex items-center gap-3 border-b border-border pb-6"><span className="flex size-11 items-center justify-center bg-secondary p-1"><Image src="/logo.png" alt="" width={40} height={40} className="size-9 object-contain" /></span><div><p className="text-sm font-semibold tracking-wide">{brand}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">Member portal</p></div><span className="ml-auto font-mono text-[10px] text-muted-foreground">MEMBER ACCESS</span></header>
      <div className="py-7"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">Welcome back</p><h2 className="mt-2 text-3xl font-light tracking-tight">Sign in to your space.</h2><p className="mt-2 text-sm text-muted-foreground">Your saved work and notes are right where you left them.</p>
        <button type="button" className="mt-6 flex w-full items-center justify-center gap-3 border border-border bg-background px-4 py-3 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"><span aria-hidden="true" className="font-semibold">G</span>Continue with Google</button>
        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground"><span className="h-px flex-1 bg-border" />or use email<span className="h-px flex-1 bg-border" /></div>
        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2"><label htmlFor={emailId} className="text-sm">Email address</label><input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/30" /></div>
          <div className="space-y-2"><div className="flex justify-between gap-2"><label htmlFor={passwordId} className="text-sm">Password</label><a href="#reset-password" className="text-xs text-primary underline-offset-4 hover:underline">Forgot password?</a></div><input id={passwordId} name="password" type="password" autoComplete="current-password" minLength={8} required className="w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-ring focus-visible:ring-2 focus-visible:ring-ring/30" /></div>
          <button type="submit" className="w-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <p aria-live="polite" className="mt-4 min-h-5 text-sm text-primary">{submitted ? "Demo submitted. Connect your auth provider to continue." : "New to Common Ground? Create an account →"}</p>
      </div>
      <p className="border-t border-border pt-4 text-center text-[10px] leading-5 text-muted-foreground">UI example only. No credentials are sent or stored.</p>
    </section>
  </ViewTransition>;
}
