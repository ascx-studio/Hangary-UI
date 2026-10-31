"use client";

import { lazy, memo, Suspense, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/hangry/components/button";
import { Kbd } from "@/hangry/components/kbd";
const CommandDialog = lazy(() =>
  import("@/components/command-dialog").then((module) => ({ default: module.CommandDialog })),
);

const CommandDemo = memo(function CommandDemo() {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      )
        return;
      if (!open && document.querySelector("dialog:modal")) return;
      event.preventDefault();
      setLoaded(true);
      setOpen(!open);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="grid w-full max-w-lg justify-items-center gap-4">
      <Button
        ref={triggerRef}
        variant="ghost"
        className="gap-2 px-2 focus:outline-none! focus-visible:outline-none! focus-visible:ring-0 focus-visible:brightness-125"
        aria-label="Open command menu"
        aria-haspopup="dialog"
        aria-controls={id}
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
      >
        <Kbd label="⌘" aria-hidden="true" className="min-h-10 min-w-10 text-base" />
        <Kbd label="+" aria-hidden="true" className="min-h-10 min-w-10 text-base" />
        <Kbd label="K" aria-hidden="true" className="min-h-10 min-w-10 text-base" />
      </Button>
      {loaded && (
        <Suspense fallback={<output className="sr-only">Loading command menu…</output>}>
          <CommandDialog
            id={id}
            open={open}
            onClose={() => setOpen(false)}
            onClosed={() => triggerRef.current?.focus()}
            onSelect={(item) => setSelected(item.label)}
          />
        </Suspense>
      )}
      {selected && (
        <output className="block text-center text-sm text-muted-foreground">
          Selected: {selected}
        </output>
      )}
    </div>
  );
});

export default CommandDemo;
