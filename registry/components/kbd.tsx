import type { ComponentProps } from "react";

interface KbdProps extends ComponentProps<"kbd"> {
  label?: string;
}

export function Kbd({ children, label = "⌘ K", className = "", ...props }: KbdProps = {}) {
  return <kbd className={`inline-flex min-h-7 items-center justify-center border border-border border-b-2 bg-neutral-800 px-2 font-mono text-xs text-neutral-200 ${className}`} {...props}>{children ?? label}</kbd>;
}
