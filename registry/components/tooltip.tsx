"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "cn";
import { Card } from "./card";
import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

export type TooltipProps = {
  /** A single focusable button or link. */
  children?: ReactElement<HTMLAttributes<HTMLElement>>;
  title?: string;
  description?: string;
  icon?: ReactNode;
  content?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
};

const positions = {
  top: "bottom-full left-1/2 -translate-x-1/2 pb-[var(--tooltip-offset)]",
  right: "left-full top-1/2 -translate-y-1/2 pl-[var(--tooltip-offset)]",
  bottom: "top-full left-1/2 -translate-x-1/2 pt-[var(--tooltip-offset)]",
  left: "right-full top-1/2 -translate-y-1/2 pr-[var(--tooltip-offset)]",
};

export function Tooltip({
  children = (
    <button
      type="button"
      className="rounded-md surface-raised px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring"
    >
      Hover or focus me
    </button>
  ),
  title,
  description,
  icon,
  content,
  side = "top",
  sideOffset = 10,
  className,
}: TooltipProps = {}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const offset =
    side === "top"
      ? { y: 4 }
      : side === "bottom"
        ? { y: -4 }
        : side === "left"
          ? { x: 4 }
          : { x: -4 };

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        className="relative inline-flex"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={(event) => {
          if (!event.currentTarget.querySelector(":focus-visible")) setOpen(false);
        }}
        onFocusCapture={(event) => {
          if (event.target.matches(":focus-visible")) setOpen(true);
        }}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget) &&
            !event.currentTarget.matches(":hover")
          )
            setOpen(false);
        }}
        style={{ "--tooltip-offset": `${Math.max(0, sideOffset)}px` } as CSSProperties}
      >
        {isValidElement(children) ? (
          cloneElement(children, {
            "aria-describedby": [children.props?.["aria-describedby"], id]
              .filter(Boolean)
              .join(" "),
          })
        ) : (
          <span tabIndex={0} aria-describedby={id}>
            {children as ReactNode}
          </span>
        )}
        <div
          id={id}
          role="tooltip"
          aria-hidden={!open}
          className={cn("absolute z-50 w-max max-w-[min(20rem,calc(100vw-2rem))]", positions[side])}
        >
          <AnimatePresence initial={false}>
            {open && (
              <m.div
                key="tooltip-panel"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.98, ...offset }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98, ...offset }}
                transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeOut" }}
              >
                <Card
                  title=""
                  description=""
                  className={cn(
                    "w-max max-w-full",
                    title || description
                      ? "w-64 p-3! text-base"
                      : "px-3! py-1.5! text-base leading-7",
                    className,
                  )}
                >
                  <div className="flex items-start gap-3">
                    {icon && (
                      <span
                        aria-hidden="true"
                        className="flex size-8 shrink-0 items-center justify-center border border-primary/20 bg-primary/10 text-secondary dark:text-primary"
                      >
                        {icon}
                      </span>
                    )}
                    <div className="min-w-0 text-left">
                      {title && (
                        <p className="text-base font-semibold leading-snug text-foreground">
                          {title}
                        </p>
                      )}
                      {description && (
                        <p className={cn("typography-caption", title && "mt-1.5")}>{description}</p>
                      )}
                      {content && (
                        <div className={cn((title || description) && "mt-2")}>{content}</div>
                      )}
                      {!title &&
                        !description &&
                        !content &&
                        "A little extra context, right when you need it."}
                    </div>
                  </div>
                </Card>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
