import { memo, type ComponentProps } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
} & ((ComponentProps<"button"> & { href?: never }) | (ComponentProps<"a"> & { href: string }));

export function buttonClassName(variant: ButtonProps["variant"] = "primary", className = "") {
  const styles = {
    primary:
      "[--button-color:var(--color-emerald-400)] [--button-top:var(--color-emerald-300)] [--button-stroke-top:var(--color-emerald-200)] [--button-stroke-bottom:var(--color-emerald-700)] text-neutral-950",
    secondary: "[--button-color:var(--secondary)] text-secondary-foreground",
    ghost: "bg-transparent text-foreground hover:bg-muted",
    destructive: "[--button-color:var(--destructive)] text-destructive-foreground",
    outline:
      "[--button-color:var(--background)] [--button-top:var(--background)] [--button-bottom:var(--muted)] [--button-stroke-top:var(--border)] [--button-stroke-bottom:color-mix(in_srgb,var(--foreground)_25%,var(--border))] text-foreground hover:[--button-top:var(--muted)]",
  };
  const surface =
    variant === "ghost"
      ? ""
      : "border border-transparent [background:linear-gradient(to_bottom,var(--button-top,color-mix(in_srgb,var(--button-color)_88%,white)),var(--button-bottom,var(--button-color)))_padding-box,linear-gradient(to_bottom,var(--button-stroke-top,color-mix(in_srgb,var(--button-color)_65%,white)),var(--button-stroke-bottom,color-mix(in_srgb,var(--button-color)_65%,black)))_border-box] shadow-[0_1px_2px_rgb(0_0_0/0.12),0_4px_8px_-2px_rgb(0_0_0/0.18)] hover:[--button-top:color-mix(in_srgb,var(--button-color)_78%,white)]";
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold  transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 ${surface} ${styles[variant] ?? styles.primary} ${className}`;
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
