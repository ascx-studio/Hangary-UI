"use client";

import { useId, useRef, type ReactNode } from "react";

interface BottomSheetProps {
  triggerLabel?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function BottomSheet({ triggerLabel = "Open bottom sheet", title = "Make yourself at home", description = "A little space for your next action. Press Escape or close to return.", children, className = "" }: BottomSheetProps = {}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  return <div className={className}>
    <button type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()} className="min-h-11 bg-emerald-400 px-5 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400">{triggerLabel}</button>
    <dialog ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto border border-border bg-neutral-900 p-6 text-white shadow-xl backdrop:bg-black/60 sm:mx-auto sm:max-w-xl">
      <div aria-hidden="true" className="mx-auto mb-6 h-1 w-10 bg-neutral-600" />
      <div className="flex items-start justify-between gap-4">
        <h2 id={`${id}-title`} className="text-xl font-semibold">{title}</h2>
        <button type="button" aria-label="Close bottom sheet" onClick={() => dialog.current?.close()} className="flex size-9 shrink-0 items-center justify-center hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-emerald-400"><span aria-hidden="true">×</span></button>
      </div>
      <p id={`${id}-description`} className="mt-3 text-sm leading-6 text-neutral-400">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </dialog>
  </div>;
}
