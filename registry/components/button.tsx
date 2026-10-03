import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
}

export function Button({
  children = "Get started",
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps = {}) {
  const styles = {
    primary: "bg-emerald-400 text-neutral-950 hover:bg-emerald-300",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-700",
    ghost: "bg-transparent text-foreground hover:bg-muted",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-border text-white hover:bg-neutral-800",
  };
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 disabled:pointer-events-none disabled:opacity-50 ${styles[variant] ?? styles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
