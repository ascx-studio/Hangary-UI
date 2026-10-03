import type { ComponentProps } from "react";

interface BadgeProps extends ComponentProps<"span"> {
  variant?: "neutral" | "info" | "success" | "warning" | "error" | "blue" | "purple" | "pink" | "teal" | "orange";
}

export function Badge({ children = "New release", variant = "success", className = "", ...props }: BadgeProps = {}) {
  const styles = {
    neutral: "bg-neutral-800 text-neutral-200",
    info: "bg-sky-400/10 text-sky-300",
    success: "bg-emerald-400/10 text-emerald-300",
    warning: "bg-amber-400/10 text-amber-300",
    error: "bg-red-400/10 text-red-300",
    blue: "bg-blue-400/10 text-blue-300",
    purple: "bg-purple-400/10 text-purple-300",
    pink: "bg-pink-400/10 text-pink-300",
    teal: "bg-teal-400/10 text-teal-300",
    orange: "bg-orange-400/10 text-orange-300",
  };
  return <span className={`inline-flex items-center border border-border px-2.5 py-1 text-xs font-medium ${styles[variant] ?? styles.success} ${className}`} {...props}>{children}</span>;
}
