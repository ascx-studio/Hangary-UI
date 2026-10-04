import type { ComponentProps, ReactNode } from "react";

type SmeBackgroundProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

export function SmeBackground({
  children,
  className = "",
  ...props
}: SmeBackgroundProps = {}) {
  return (
    <div
      className={`relative isolate min-h-96 overflow-hidden border border-border bg-neutral-950 text-white ${className}`}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.35),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.28),transparent_28%),linear-gradient(135deg,rgba(24,24,27,0.95),rgba(2,6,23,0.98))]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[48px_48px] opacity-30"
      />
      {children  }
    </div>
  );
}
