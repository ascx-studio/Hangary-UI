import { memo, type ComponentProps } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
} & ((ComponentProps<"button"> & { href?: never }) | (ComponentProps<"a"> & { href: string }));

export function buttonClassName(variant: ButtonProps["variant"] = "primary", className = "") {
  const styles = {
    primary:
      "border border-emerald-700/40 bg-linear-to-b from-emerald-300 to-emerald-400 text-neutral-950 shadow-[0_1px_2px_rgb(0_0_0/0.18),0_4px_8px_-2px_rgb(0_102_78/0.25)] hover:from-emerald-200 hover:to-emerald-300",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "bg-transparent text-foreground hover:bg-muted",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-border text-foreground hover:bg-muted",
  };
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 disabled:pointer-events-none disabled:opacity-50 ${styles[variant] ?? styles.primary} ${className}`;
}

export const Button = memo(function Button({
  children = "Get started",
  variant = "primary",
  className = "",
  ...props
}: ButtonProps = {}) {
  const classes = buttonClassName(variant, className);

  if (props.href !== undefined) {
    return (
      <a className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
});
