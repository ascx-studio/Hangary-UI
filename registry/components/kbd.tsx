import type { ComponentProps } from "react";

interface KbdProps extends ComponentProps<"kbd"> {
  label?: string;
}

export function Kbd({ children, label = "⌘ K", className = "", ...props }: KbdProps = {}) {
  return (
    <kbd
      className={`inline-flex min-h-7 items-center justify-center rounded-md surface-raised border-b-2 [--surface-color:var(--muted)] px-2 font-mono text-xs text-foreground ${className}`}
      {...props}
    >
      {children ?? label}
    </kbd>
  );
}
