"use client";

import { memo, useState, type ReactNode } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";

interface BannerProps {
  variant?: "neutral" | "info" | "success" | "warning" | "error";
  children?: ReactNode;
  message?: string;
  description?: string;
  dismissible?: boolean;
  className?: string;
}

const statusStyles = {
  neutral: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-400",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  success: "bg-green-500/10 text-green-700 dark:text-green-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  error: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const statusIcons = {
  neutral: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
};

export const Banner = memo(function Banner({
  variant = "info",
  children,
  message = "A little update. A lot of possibilities. Explore what's new.",
  description,
  dismissible = true,
  className = "",
}: BannerProps = {}) {
  const Icon = statusIcons[variant];
  const reducedMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      role={variant === "error" ? "alert" : "status"}
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={reducedMotion ? undefined : { y: -2, scale: 1.005 }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
      className={`flex items-start gap-4 rounded-xl border-0 px-5 py-4 text-base leading-7 ${statusStyles[variant]} ${className}`}
    >
      {Icon && <Icon aria-hidden="true" className="mt-0.5 size-6 shrink-0" strokeWidth={2} />}
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{children ?? message}</div>
        {description && <p className="mt-1 text-sm leading-6 opacity-90">{description}</p>}
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={() => setDismissed(true)}
          className="flex size-9 shrink-0 items-center justify-center hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-current"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </motion.div>
  );
});
