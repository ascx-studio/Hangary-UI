"use client";

import { useState, type ReactNode } from "react";

interface BannerProps {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  children?: ReactNode;
  message?: string;
  dismissible?: boolean;
  className?: string;
}

export function Banner({ variant = "primary", children, message = "A little update. A lot of possibilities. Explore what's new.", dismissible = true, className = "" }: BannerProps = {}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-card text-card-foreground",
    ghost: "bg-transparent text-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return <div role="status" className={`flex items-center justify-between gap-4 border border-border px-5 py-4 text-sm ${styles[variant] ?? styles.primary} ${className}`}>
    <div>{children ?? message}</div>
    {dismissible && <button type="button" aria-label="Dismiss banner" onClick={() => setDismissed(true)} className="flex size-9 shrink-0 items-center justify-center hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-current"><span aria-hidden="true">×</span></button>}
  </div>;
}
