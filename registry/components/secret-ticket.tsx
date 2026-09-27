"use client";

import { useId, useState } from "react";

export function SecretTicket({ title = "The midnight session", code = "AFTER-HOURS", detail = "Your invitation to something a little out of the ordinary." }: { title?: string; code?: string; detail?: string }) {
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState("");
  const id = useId();
  return (
    <article className="mx-auto w-full max-w-md overflow-hidden bg-card text-card-foreground shadow-xl">
      <div className="flex items-center justify-between border-b border-border px-6 py-4 font-mono text-[10px] uppercase tracking-[.2em]"><span>After hours club</span><span>Admit / 01</span></div>
      <div className="px-6 py-8 sm:px-8"><p className="font-mono text-xs uppercase tracking-widest text-primary">You&apos;re on the list</p><h3 className="mt-4 max-w-xs text-4xl font-semibold leading-tight tracking-tight">{title}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{detail}</p>
        <div aria-hidden="true" className="mt-8 flex h-10 items-end gap-1">{Array.from({ length: 45 }, (_, i) => <span key={i} className="flex-1 bg-foreground" style={{ height: `${40 + ((i * 17) % 60)}%`, opacity: i % 4 === 0 ? .25 : 1 }} />)}</div>
        <p className="mt-2 font-mono text-[9px] tracking-[.35em] text-muted-foreground">PRIVATE EDITION — NOT A VALID TICKET</p>
      </div>
      <div className="relative border-t-2 border-dashed border-border bg-muted px-6 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-widest">Your access code</span><button type="button" aria-expanded={revealed} aria-controls={id} onClick={() => { setRevealed(!revealed); setStatus(""); }} className="border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{revealed ? "Seal again ↙" : "Break the seal ↗"}</button></div>
        <div id={id} className="mt-5 flex min-h-12 items-center justify-between gap-3 bg-secondary px-4 py-3 text-secondary-foreground">
          <span className="break-all font-mono text-sm tracking-widest">{revealed ? code : "•••• — ••••"}</span>
          {revealed && <button type="button" className="shrink-0 px-2 py-1 text-xs underline underline-offset-4 focus-visible:outline-2" onClick={async () => { try { await navigator.clipboard.writeText(code); setStatus("Code copied."); } catch { setStatus("Select the code to copy it manually."); } }}>Copy</button>}
        </div><p role="status" className="mt-2 min-h-4 text-xs text-muted-foreground">{status}</p>
      </div>
    </article>
  );
}
