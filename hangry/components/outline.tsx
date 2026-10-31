"use client";

import {
  memo,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import { LazyMotion, domMax, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export interface OutlineItem {
  id: string;
  label: string;
  href?: string;
  indent?: boolean;
}

export interface OutlineProps extends Omit<ComponentProps<"nav">, "children"> {
  items: OutlineItem[];
  title?: string;
  variant?: "default" | "sidebar";
  track?: "line" | "trail";
  onNavigate?: () => void;
}

const outlineTrailWidth = 24.5;
const outlineTrailRowHeight = 36;

function getOutlineTrailPath(items: OutlineItem[]) {
  const totalHeight = Math.max(items.length * outlineTrailRowHeight, 1);
  const endY = Math.max(totalHeight - 4, 4);
  let x = 8.5;
  let path = `M${x} 4`;

  items.forEach((item, index) => {
    const rowEnd =
      index === items.length - 1
        ? endY
        : Math.min((index + 1) * outlineTrailRowHeight, totalHeight);
    const nextX = items[index + 1]?.indent ? 16.5 : 8.5;

    if (nextX !== x) {
      const curveStart = Math.max(rowEnd - 8, 4);
      const curveEnd = Math.min(rowEnd + 8, totalHeight);
      path += ` L${x} ${curveStart} C${x} ${rowEnd - 2} ${nextX} ${rowEnd + 2} ${nextX} ${curveEnd}`;
      x = nextX;
    } else {
      path += ` L${x} ${rowEnd}`;
    }
  });

  return { path, totalHeight, endX: x, endY };
}

export const Outline = memo(function Outline({
  items,
  title = "On this page",
  variant = "default",
  track = "line",
  onNavigate,
  className = "",
  ...props
}: OutlineProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const links = useRef<Array<HTMLAnchorElement | null>>([]);
  const indicatorId = useId();
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  const routeNavigation = items.some((item) => item.href);
  const routeIndex = items.findIndex(
    (item) => item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
  const activeIndex = Math.max(
    0,
    routeIndex >= 0 ? routeIndex : items.findIndex((item) => item.id === activeId),
  );
  const trackProgress = (activeIndex + 1) / Math.max(items.length, 1);
  const {
    path: outlineTrailPath,
    totalHeight: outlineTrailHeight,
    endX: outlineTrailEndX,
    endY: outlineTrailEndY,
  } = getOutlineTrailPath(items);

  useEffect(() => setFocusedId(null), [pathname]);

  useEffect(() => {
    if (routeNavigation) return;
    let frame = 0;
    const updateActive = () => {
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top <= 120) {
          current = item.id;
        }
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = items.at(-1)?.id ?? current;
      }
      if (current) setActiveId(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, routeNavigation]);

  function activate(item: OutlineItem) {
    if (item.href) {
      onNavigate?.();
      router.push(item.href);
      return;
    }
    const { id } = item;
    const heading = document.getElementById(id);
    if (!heading) return;
    const hash = `#${encodeURIComponent(id)}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    heading.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    setActiveId(id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowDown") nextIndex = Math.min(items.length - 1, index + 1);
    else if (event.key === "ArrowUp") nextIndex = Math.max(0, index - 1);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(items[index]);
      return;
    } else return;

    event.preventDefault();
    setActiveId(items[nextIndex].id);
    setFocusedId(items[nextIndex].id);
    links.current[nextIndex]?.focus();
  }

  return (
    <LazyMotion features={domMax} strict>
      <nav aria-label={title} className={`w-56 ${className}`} {...props}>
        <h2
          className={`mb-3 typography-label ${variant === "sidebar" ? "text-muted-foreground/80" : ""}`}
        >
          {title}
        </h2>
        <div className="relative">
          {track === "trail" && (
            <>
              <svg
                aria-hidden="true"
                viewBox={`0 0 ${outlineTrailWidth} ${outlineTrailHeight}`}
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-[24.5px] overflow-visible"
              >
                <path d={outlineTrailPath} className="stroke-border" strokeWidth="1" fill="none" />
                <circle cx="8.5" cy="4" r="4" className="fill-foreground" />
                <circle
                  cx={outlineTrailEndX}
                  cy={outlineTrailEndY}
                  r="4"
                  className="fill-foreground"
                />
              </svg>
              <m.svg
                aria-hidden="true"
                viewBox={`0 0 ${outlineTrailWidth} ${outlineTrailHeight}`}
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-[24.5px] overflow-visible"
                initial={false}
                transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
              >
                <m.path
                  d={outlineTrailPath}
                  className="stroke-foreground"
                  strokeWidth="1"
                  fill="none"
                  pathLength="1"
                  strokeDasharray={`${trackProgress} 1`}
                  initial={false}
                  animate={{ strokeDasharray: `${trackProgress} 1` }}
                  transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
                />
              </m.svg>
            </>
          )}
          <m.ul
            initial={variant === "sidebar" && !reducedMotion ? "hidden" : false}
            animate={variant === "sidebar" ? "visible" : undefined}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: reducedMotion ? 0 : 0.035 } },
            }}
            className={`relative space-y-1 ${track === "trail" || variant === "sidebar" ? "" : "before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border before:content-['']"}`}
          >
            {items.map((item, index) => {
              const active = item.href
                ? pathname === item.href || pathname.startsWith(`${item.href}/`)
                : item.id === activeId;
              return (
                <m.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: reducedMotion ? 0 : 4 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: reducedMotion ? 0 : 0.14 },
                    },
                  }}
                  className={`relative min-h-8 ${track === "trail" ? (item.indent ? "pl-14" : "pl-8") : "pl-4"}`}
                >
                  {active && track !== "trail" && (
                    <m.span
                      layoutId={`outline-indicator-${indicatorId}`}
                      aria-hidden="true"
                      transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 z-10 w-0.5 bg-primary"
                    />
                  )}
                  <Link
                    ref={(element) => {
                      links.current[index] = element;
                    }}
                    href={item.href ?? `#${encodeURIComponent(item.id)}`}
                    aria-current={active ? (item.href ? "page" : "location") : undefined}
                    tabIndex={
                      (routeNavigation
                        ? (focusedId ??
                          items.find(
                            (entry) =>
                              entry.href === pathname || pathname.startsWith(`${entry.href}/`),
                          )?.id)
                        : activeId) === item.id
                        ? 0
                        : -1
                    }
                    onClick={(event) => {
                      if (item.href) {
                        if (
                          !event.defaultPrevented &&
                          !event.metaKey &&
                          !event.ctrlKey &&
                          !event.altKey &&
                          !event.shiftKey
                        )
                          onNavigate?.();
                        return;
                      }
                      event.preventDefault();
                      activate(item);
                    }}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className={`flex min-h-8 items-center text-sm leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 ${variant === "sidebar" ? "focus-visible:outline-sidebar-ring" : "focus-visible:outline-ring"} ${active ? `font-medium ${variant === "sidebar" ? "text-sidebar-foreground" : "text-foreground"}` : `text-muted-foreground ${variant === "sidebar" ? "hover:text-sidebar-foreground" : "hover:text-foreground"}`}`}
                  >
                    {item.label}
                  </Link>
                </m.li>
              );
            })}
          </m.ul>
        </div>
      </nav>
    </LazyMotion>
  );
});
