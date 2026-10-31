"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useState, type ReactNode, type RefObject } from "react";
import { cn } from "cn";
import { Tooltip } from "./tooltip";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

/** Inspired by Devouring Details and Skiper UI. */
const MotionLink = m.create(Link);
const LINE_WIDTHS = { sm: [32, 24, 20, 16], md: [56, 44, 36, 28] };
const PROXIMITY_RADIUS = 40;

export type NavLineItem = {
  id: string;
  label: string;
  /** Navigate instead of scrolling to a section. */
  href?: string;
  card?: { title: string; description?: string; icon?: ReactNode };
};

export type NavLineProps = {
  items?: NavLineItem[];
  activeId?: string;
  showLabels?: boolean;
  size?: "sm" | "md";
  variant?: "viewport" | "contained";
  scrollRootRef?: RefObject<HTMLElement | null>;
  onSectionClick?: (targetSectionId: string, currentSectionId?: string) => void;
  className?: string;
};

const EMPTY_ITEMS: NavLineItem[] = [];

const ProximityDash = memo(function ProximityDash({
  width,
  reducedMotion,
  highlighted,
}: {
  width: number;
  reducedMotion: boolean | null;
  highlighted: boolean;
}) {
  return (
    <m.span
      aria-hidden="true"
      data-nav-line=""
      className={cn(
        "block h-0.5 dark:h-px shrink-0 transition-colors group-hover:bg-secondary dark:group-hover:bg-foreground group-focus-visible:bg-secondary dark:group-focus-visible:bg-foreground group-aria-[current=page]:bg-secondary dark:group-aria-[current=page]:bg-foreground group-aria-[current=location]:bg-secondary dark:group-aria-[current=location]:bg-foreground",
        highlighted ? "bg-secondary dark:bg-foreground" : "bg-foreground/60 dark:bg-muted-foreground/40",
      )}
      initial={false}
      animate={{ width }}
      transition={
        reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34, mass: 0.7 }
      }
    />
  );
});

export const NavLine = memo(function NavLine({
  items = EMPTY_ITEMS,
  activeId,
  showLabels = false,
  size = "md",
  variant = "viewport",
  scrollRootRef,
  onSectionClick,
  className,
}: NavLineProps = {}) {
  const reducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [proximityIndex, setProximityIndex] = useState<number | null>(null);
  const [tracked, setTracked] = useState(() => items[0]?.id ?? "");
  const active = activeId ?? (items.some((item) => item.id === tracked) ? tracked : items[0]?.id);
  const scrollIds = useMemo(
    () => items.filter((item) => !item.href).map((item) => item.id),
    [items],
  );

  useEffect(() => {
    if (!scrollIds.length || activeId !== undefined) return;

    const startTracking = () => {
      const scrollRoot = scrollRootRef?.current ?? null;
      const targets = scrollIds
        .map((id) => document.getElementById(id))
        .filter((target): target is HTMLElement =>
          Boolean(target && (!scrollRoot || scrollRoot.contains(target))),
        );
      if (!targets.length) return () => {};

      const visible = new Set<HTMLElement>();
      const pickClosest = () => {
        const rootTop = scrollRoot?.getBoundingClientRect().top ?? 0;
        const rootHeight = scrollRoot?.clientHeight ?? window.innerHeight;
        const bandCenter = rootTop + rootHeight * 0.4;
        let closest: HTMLElement | undefined;
        let bestDistance = Infinity;
        for (const target of targets) {
          if (!visible.has(target)) continue;
          const distance = Math.abs(target.getBoundingClientRect().top - bandCenter);
          if (distance < bestDistance) {
            closest = target;
            bestDistance = distance;
          }
        }
        if (closest) setTracked(closest.id);
      };
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const target = entry.target as HTMLElement;
            if (entry.isIntersecting) visible.add(target);
            else visible.delete(target);
          }
          pickClosest();
        },
        { root: scrollRoot, rootMargin: "-25% 0px -45% 0px", threshold: 0 },
      );
      targets.forEach((target) => observer.observe(target));

      const onScroll = () => {
        const scrollHeight = scrollRoot?.scrollHeight ?? document.documentElement.scrollHeight;
        const clientHeight = scrollRoot?.clientHeight ?? window.innerHeight;
        const scrollTop = scrollRoot?.scrollTop ?? window.scrollY;
        if (scrollHeight > clientHeight && scrollHeight - scrollTop - clientHeight < 4) {
          setTracked(targets[targets.length - 1].id);
        } else {
          pickClosest();
        }
      };
      const source = scrollRoot ?? window;
      source.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        observer.disconnect();
        source.removeEventListener("scroll", onScroll);
      };
    };

    if (variant === "contained") return startTracking();
    const query = window.matchMedia("(min-width: 64rem)");
    let teardown: (() => void) | undefined;
    const syncTracking = () => {
      if (query.matches && !teardown) teardown = startTracking();
      else if (!query.matches && teardown) {
        teardown();
        teardown = undefined;
      }
    };
    syncTracking();
    query.addEventListener("change", syncTracking);
    return () => {
      query.removeEventListener("change", syncTracking);
      teardown?.();
    };
  }, [scrollIds, scrollRootRef, variant, activeId]);

  const scrollTo = (id: string) => {
    const scrollRoot = scrollRootRef?.current ?? null;
    const target = document.getElementById(id);
    if (!target || (scrollRoot && !scrollRoot.contains(target))) return;
    onSectionClick?.(id, active);
    setTracked(id);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    if (scrollRoot) {
      scrollRoot.scrollTo({
        top:
          scrollRoot.scrollTop +
          target.getBoundingClientRect().top -
          scrollRoot.getBoundingClientRect().top -
          scrollRoot.clientTop,
        behavior,
      });
    } else target.scrollIntoView({ behavior, block: "start" });
  };

  const widths = LINE_WIDTHS[size];
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === active),
  );
  const trackPointer = (event: React.PointerEvent<HTMLElement>) => {
    const dashes = [...event.currentTarget.querySelectorAll<HTMLElement>("[data-nav-line]")];
    let closestIndex: number | null = null;
    let closestDistance = PROXIMITY_RADIUS;
    dashes.forEach((dash, index) => {
      const rect = dash.getBoundingClientRect();
      const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });
    setProximityIndex(closestIndex);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <nav
        aria-label="Sections"
        onPointerMove={trackPointer}
        onPointerLeave={() => {
          setHoveredIndex(null);
          setProximityIndex(null);
        }}
        className={cn(
          "top-1/2 left-0 z-30 -translate-y-1/2 flex-col items-start gap-2",
          variant === "contained" ? "absolute flex" : "fixed hidden lg:flex",
          className,
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-1 left-0 border-l border-dashed border-border/60"
        />
        {items.map((item, index) => {
          const isActive = active === item.id;
          const isSelected = isActive || hoveredIndex === index || proximityIndex === index;
          const activeWidth = widths[Math.min(Math.abs(activeIndex - index), widths.length - 1)];
          const hoverIndex = proximityIndex ?? hoveredIndex;
          const hoverWidth =
            hoverIndex === null
              ? 0
              : widths[Math.min(Math.abs(hoverIndex - index), widths.length - 1)];
          const width = Math.max(activeWidth, hoverWidth);
          const highlighted = isSelected;
          const rowClass =
            "group relative -my-1.5 flex cursor-pointer items-center gap-3 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
          const contents = (
            <>
              <ProximityDash
                width={width}
                reducedMotion={reducedMotion}
                highlighted={highlighted}
              />
              {showLabels && (
                <span
                  data-nav-label=""
                  className="whitespace-nowrap text-sm text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground group-aria-[current=page]:text-foreground group-aria-[current=location]:text-foreground motion-reduce:transition-none"
                >
                  {item.label}
                </span>
              )}
            </>
          );
          return (
            <Tooltip
              key={item.id}
              side="right"
              sideOffset={10}
              className={item.card ? "w-60" : undefined}
              title={item.card?.title}
              description={item.card?.description}
              icon={item.card?.icon}
              content={item.card ? undefined : item.label}
            >
              {item.href ? (
                <MotionLink
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  initial={variant === "contained" && !reducedMotion ? { opacity: 0, y: 5 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.16,
                    delay: variant === "contained" && !reducedMotion ? index * 0.03 : 0,
                  }}
                  className={rowClass}
                  onHoverStart={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                >
                  {contents}
                </MotionLink>
              ) : (
                <m.button
                  type="button"
                  aria-label={item.label}
                  aria-current={isActive ? "location" : undefined}
                  initial={variant === "contained" && !reducedMotion ? { opacity: 0, y: 5 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.16,
                    delay: variant === "contained" && !reducedMotion ? index * 0.03 : 0,
                  }}
                  onClick={() => scrollTo(item.id)}
                  className={rowClass}
                  onHoverStart={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                >
                  {contents}
                </m.button>
              )}
            </Tooltip>
          );
        })}
      </nav>
    </LazyMotion>
  );
});
