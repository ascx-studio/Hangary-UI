"use client";

import { memo, type ReactNode } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion, type HTMLMotionProps } from "motion/react";
import {
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock3,
  SearchCheck,
  Send,
  TriangleAlert,
} from "lucide-react";

interface BadgeProps extends Omit<HTMLMotionProps<"span">, "children"> {
  children?: ReactNode;
  variant?:
    | "pending"
    | "in-progress"
    | "submitted"
    | "in-review"
    | "success"
    | "failed"
    | "expired"
    | "neutral"
    | "info"
    | "warning"
    | "error"
    | "blue"
    | "purple"
    | "pink"
    | "teal"
    | "orange";
}

const statuses = {
  pending: { label: "Pending", icon: TriangleAlert },
  "in-progress": { label: "In progress", icon: CircleDashed },
  submitted: { label: "Submitted", icon: Send },
  "in-review": { label: "In review", icon: SearchCheck },
  success: { label: "Success", icon: CircleCheck },
  failed: { label: "Failed", icon: CircleX },
  expired: { label: "Expired", icon: Clock3 },
};

const styles = {
  pending: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  "in-progress": "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  submitted: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  "in-review": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  success: "bg-green-500/10 text-green-700 dark:text-green-400",
  failed: "bg-red-500/10 text-red-700 dark:text-red-400",
  expired: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-400",
  neutral: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-400",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  error: "bg-red-500/10 text-red-700 dark:text-red-400",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  pink: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  teal: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  orange: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

export const Badge = memo(function Badge({
  children,
  variant = "success",
  className = "",
  ...props
}: BadgeProps = {}) {
  const status = variant in statuses ? statuses[variant as keyof typeof statuses] : undefined;
  const Icon = status?.icon;
  const reducedMotion = useReducedMotion();

  return (
    <motion.span
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      whileHover={reducedMotion ? undefined : { y: -2, scale: 1.03 }}
      transition={{ duration: reducedMotion ? 0 : 0.35, ease: "easeOut" }}
      className={`inline-flex items-center gap-2 rounded-lg surface-raised surface-status px-3 py-2 typography-label ${styles[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon aria-hidden="true" className="size-[1.15em] shrink-0" strokeWidth={2.25} />}
      {children ?? status?.label ?? "New release"}
    </motion.span>
  );
});
