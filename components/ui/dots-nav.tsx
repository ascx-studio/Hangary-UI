"use client";

import Link from "next/link";
import { useState, type ComponentProps, type MouseEvent } from "react";
import { LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/cn";

const MotionLink = m.create(Link);
const loadFeatures = () => import("./motion-features").then(module => module.default);
const spring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 26,
  mass: 0.8,
};

export type DotsNavItem = { title: string; href: string };

export interface DotsNavProps extends ComponentProps<"nav"> {
  items: DotsNavItem[];
  activeHref?: string;
  orientation?: "vertical" | "horizontal";
  expanded?: boolean;
  onItemClick?: (
    item: DotsNavItem,
    event: MouseEvent<HTMLAnchorElement>,
  ) => void;
}

export function DotsNav({
  items,
  activeHref,
  orientation = "vertical",
  expanded,
  onItemClick,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: DotsNavProps) {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [focusedHref, setFocusedHref] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const visibleHref = hoveredHref ?? focusedHref;
  const transition = reducedMotion ? { duration: 0 } : spring;

  return (
    <LazyMotion features={loadFeatures} strict>
    <nav
      {...props}
      data-slot="dots-nav"
      data-orientation={orientation}
      className={cn("w-fit", className)}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHoveredHref(null);
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocusedHref(null);
        onBlur?.(event);
      }}
    >
      <ul
        className={cn(
          "flex gap-1",
          orientation === "vertical" ? "flex-col" : "flex-row",
        )}
      >
        {items.map((item) => (
          <li key={item.href}>
            <MotionLink
              href={item.href}
              aria-label={item.title}
              aria-current={item.href === activeHref ? "page" : undefined}
              onClick={(event) => onItemClick?.(item, event)}
              onHoverStart={() => setHoveredHref(item.href)}
              onHoverEnd={() => setHoveredHref(null)}
              onFocus={() => setFocusedHref(item.href)}
              onBlur={() => setFocusedHref(null)}
              initial={false}
              animate={item.href === activeHref ? "active" : "normal"}
              whileHover="hover"
              whileFocus="hover"
              transition={transition}
              variants={{
                normal: { scale: 1 },
                active: { scale: 1 },
                hover: { scale: reducedMotion ? 1 : 1.06 },
              }}
              className="pointer-events-auto flex h-10 w-fit origin-left items-center rounded-md text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="flex size-10 shrink-0 items-center justify-center">
                <m.span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-current"
                  transition={transition}
                  variants={{
                    normal: {
                      scale: 0.5,
                      backgroundColor: "var(--muted-foreground)",
                    },
                    active: { scale: 1, backgroundColor: "var(--primary)" },
                    hover: {
                      scale: item.href === activeHref ? 1.25 : 0.75,
                      backgroundColor: "var(--primary)",
                    },
                  }}
                />
              </span>
              <span
                aria-hidden="true"
                hidden={expanded === false || item.href !== visibleHref}
                className="overflow-hidden whitespace-nowrap text-sm"
              >
                {item.title}
              </span>
            </MotionLink>
          </li>
        ))}
      </ul>
    </nav>
    </LazyMotion>
  );
}
