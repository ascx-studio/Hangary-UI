"use client";

import { memo, useEffect, useRef } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Command, type CommandItem, type CommandProps } from "@/hangry/components/command";

interface CommandDialogProps {
  id: string;
  open: boolean;
  layoutId?: string;
  onClose: () => void;
  onClosed?: () => void;
  items?: CommandProps["items"];
  onSelect?: CommandProps["onSelect"];
}

export const CommandDialog = memo(function CommandDialog({
  id,
  open,
  layoutId,
  onClose,
  onClosed,
  items,
  onSelect,
}: CommandDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pendingSelection = useRef<CommandItem | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog) {
      if (!dialog.open) dialog.showModal();
      dialog.querySelector<HTMLInputElement>("input")?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="Command menu"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        onClose();
        onClosed?.();
        const item = pendingSelection.current;
        pendingSelection.current = null;
        if (item) onSelect?.(item);
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-foreground outline-none backdrop:bg-black/60"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close command menu"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-transparent outline-none"
      />
      <div className="pointer-events-none relative flex h-full w-full items-center justify-center p-4">
        <AnimatePresence
          onExitComplete={() => {
            if (!open) dialogRef.current?.close();
          }}
        >
          {open && (
            <motion.div
              key="command-panel"
              layoutId={reducedMotion ? undefined : layoutId}
              className="pointer-events-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
              initial={
                reducedMotion || layoutId
                  ? false
                  : { opacity: 0, y: 24, scale: 0.95, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : layoutId
                    ? { opacity: 1 }
                    : { opacity: 0, y: 12, scale: 0.97, filter: "blur(4px)" }
              }
              transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <Command
                items={items}
                onSelect={(item) => {
                  pendingSelection.current = item;
                  onClose();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </dialog>
  );
});
