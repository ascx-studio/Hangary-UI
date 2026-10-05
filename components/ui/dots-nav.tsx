"use client";

import Link from "next/link";
import { memo, useState, type ComponentProps, type MouseEvent } from "react";
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
  ...props
}: DotsNavProps) {
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={loadFeatures} strict>
      <nav
        {...props}
        data-slot="dots-nav"
        data-orientation={orientation}
        className={cn(
          "w-fit [&:has(a:hover)_a:not(:hover)_[data-dot-label]]:hidden",
          className,
        )}
      >
        <ul
          className={cn(
            "flex gap-1",
            orientation === "vertical" ? "flex-col" : "flex-row",
          )}
        >
          {items.map((item) => (
            <DotsNavLink
              key={item.href}
              item={item}
              active={item.href === activeHref}
              expanded={expanded}
              onItemClick={onItemClick}
              reducedMotion={reducedMotion}
            />
          ))}
        </ul>
      </nav>
    </LazyMotion>
  );
}

const DotsNavLink = memo(function DotsNavLink({
  item,
  active,
  expanded,
  onItemClick,
  reducedMotion,
}: {
  item: DotsNavItem;
  active: boolean;
  expanded?: boolean;
  onItemClick?: DotsNavProps["onItemClick"];
  reducedMotion: boolean | null;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const transition = reducedMotion ? { duration: 0 } : spring;
  return <li>
    <MotionLink
      href={item.href}
      aria-label={item.title}
      aria-current={active ? "page" : undefined}
      onClick={(event) => onItemClick?.(item, event)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      initial={false}
      animate={active ? "active" : "normal"}
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
              scale: active ? 1.25 : 0.75,
              backgroundColor: "var(--primary)",
            },
          }}
        />
      </span>
      <span
        data-dot-label=""
        aria-hidden="true"
        hidden={expanded === false || !(hovered || focused)}
        className="overflow-hidden whitespace-nowrap text-sm"
      >
        {item.title}
      </span>
    </MotionLink>
  </li>;
});
