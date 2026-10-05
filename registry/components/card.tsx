import type { ComponentProps, ReactNode } from "react";

interface CardProps extends Omit<ComponentProps<"article">, "title"> {
  title?: string;
  description?: string;
  footer?: ReactNode;
}

export function Card({ title = "Room for your next idea", description = "A simple starting point for something great. Make it yours.", children, footer, className = "", ...props }: CardProps = {}) {
  return <article className={`w-full max-w-sm border border-border bg-card p-6 text-card-foreground shadow-sm ${className}`} {...props}>
    {title && <h3 className="text-lg font-semibold">{title}</h3>}
    {description && <p className="mt-2 text-sm leading-6 opacity-80">{description}</p>}
    {children && <div className={title || description || footer ? "mt-5" : "h-full min-h-0"}>{children}</div>}
    {footer && <footer className="mt-5 border-t border-border pt-4">{footer}</footer>}
  </article>;
}
