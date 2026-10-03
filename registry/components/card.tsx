import type { ComponentProps, ReactNode } from "react";

interface CardProps extends Omit<ComponentProps<"article">, "title"> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  title?: string;
  description?: string;
  footer?: ReactNode;
}

export function Card({ variant = "secondary", title = "Room for your next idea", description = "A simple starting point for something great. Make it yours.", children, footer, className = "", ...props }: CardProps = {}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-card text-card-foreground",
    ghost: "bg-transparent text-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };
  return <article className={`w-full max-w-sm border border-border p-6 shadow-sm ${styles[variant] ?? styles.secondary} ${className}`} {...props}>
    {title && <h3 className="text-lg font-semibold">{title}</h3>}
    {description && <p className="mt-2 text-sm leading-6 opacity-80">{description}</p>}
    {children && <div className={title || description || footer ? "mt-5" : "h-full min-h-0"}>{children}</div>}
    {footer && <footer className="mt-5 border-t border-border pt-4">{footer}</footer>}
  </article>;
}
