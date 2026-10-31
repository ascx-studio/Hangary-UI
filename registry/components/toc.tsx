"use client";

import { memo, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";
import { Card } from "./card";

export type TocItem = { id: string; label: string; level?: 1 | 2 | 3 };
type TocProps = { items: TocItem[]; title?: string; className?: string };

export const Toc = memo(function Toc({
  items,
  title = "Table of contents",
  className = "",
}: TocProps) {
  const [active, setActive] = useState<Set<string>>(new Set(items[0] ? [items[0].id] : []));
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const sections = items.flatMap((item) => {
        const element = document.getElementById(item.id);
        if (!element) return [];
        const rect = element.getBoundingClientRect();
        return [{ id: item.id, top: rect.top, bottom: rect.bottom }];
      });
      const visible = sections
        .filter((section) => section.bottom > 0 && section.top < window.innerHeight)
        .map((section) => section.id);
      const scrollRoot = document.scrollingElement ?? document.documentElement;
      const atPageBottom =
        scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 1;
      if (atPageBottom && items.at(-1) && !visible.includes(items.at(-1)!.id)) {
        visible.push(items.at(-1)!.id);
      }
      if (!visible.length) {
        const previous = sections.filter((section) => section.top <= 0).at(-1)?.id;
        if (previous) visible.push(previous);
        else if (items[0]) visible.push(items[0].id);
      }
      setActive((current) =>
        current.size === visible.length && visible.every((id) => current.has(id))
          ? current
          : new Set(visible),
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return (
    <nav
      aria-label={title}
      data-active={active.size > 0}
      className={`group/toc relative flex w-8 justify-center py-2 ${className}`}
      onMouseLeave={() => setHovered(null)}
    >
      <ul className="flex flex-col items-center gap-2.5" aria-label={title}>
        {items.map((item) => (
          <li key={item.id}>
            <motion.a
              href={`#${encodeURIComponent(item.id)}`}
              aria-label={item.label}
              data-active={active.has(item.id)}
              aria-current={Array.from(active).at(-1) === item.id ? "location" : undefined}
              onMouseEnter={() => setHovered(item.id)}
              onFocus={() => setHovered(item.id)}
              onBlur={() => setHovered(null)}
              whileHover={reduced ? undefined : { scaleX: 1.08 }}
              transition={{ duration: reduced ? 0 : 0.12 }}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const heading = document.getElementById(item.id);
                if (!heading) return;
                event.preventDefault();
                window.history.pushState(null, "", `#${encodeURIComponent(item.id)}`);
                heading.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
                setActive(new Set([item.id]));
              }}
              style={{
                width: item.level === 3 ? 12 : item.level === 2 ? 20 : 32,
                marginLeft: ((item.level ?? 1) - 1) * 6,
              }}
              className="block h-0.5 dark:h-px rounded-full bg-foreground/60 dark:bg-muted-foreground/40 transition-colors hover:bg-secondary dark:hover:bg-foreground dark:hover:shadow-[0_0_5px_1px_color-mix(in_srgb,var(--foreground)_65%,transparent)] focus-visible:bg-secondary dark:focus-visible:bg-foreground dark:focus-visible:shadow-[0_0_5px_1px_color-mix(in_srgb,var(--foreground)_65%,transparent)] focus-visible:outline-none data-[active=true]:bg-secondary dark:data-[active=true]:bg-foreground dark:data-[active=true]:shadow-[0_0_5px_1px_color-mix(in_srgb,var(--foreground)_65%,transparent)]"
            >
              <span className="sr-only">{item.label}</span>
            </motion.a>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute right-0 top-1/2 z-50 w-80 max-w-[calc(100vw-2rem)] -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover/toc:pointer-events-auto group-hover/toc:opacity-100 group-focus-within/toc:pointer-events-auto group-focus-within/toc:opacity-100">
        <Card size="sm" className="w-80 max-w-[calc(100vw-2rem)] p-3">
          <p className="sr-only">{title}</p>
          <ul className="max-h-[70vh] space-y-0.5 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} style={{ paddingLeft: ((item.level ?? 1) - 1) * 20 }}>
                <a
                  href={`#${encodeURIComponent(item.id)}`}
                  data-active={active.has(item.id)}
                  aria-current={Array.from(active).at(-1) === item.id ? "location" : undefined}
                  onMouseEnter={() => setHovered(item.id)}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    const heading = document.getElementById(item.id);
                    if (!heading) return;
                    event.preventDefault();
                    window.history.pushState(null, "", `#${encodeURIComponent(item.id)}`);
                    heading.scrollIntoView({
                      behavior: reduced ? "auto" : "smooth",
                      block: "start",
                    });
                    setActive(new Set([item.id]));
                  }}
                  className={`block rounded-md px-2 py-1.5 text-sm leading-5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground focus-visible:outline-none data-[active=true]:bg-secondary/15 dark:data-[active=true]:bg-muted data-[active=true]:text-foreground ${hovered === item.id ? "bg-muted text-foreground" : ""}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </nav>
  );
});
