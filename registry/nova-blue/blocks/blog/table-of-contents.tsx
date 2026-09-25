"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "../../../lib/portfolio/utils";

interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // Sort by how close they are to the top of the viewport
        const sorted = visibleEntries.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
        );
        setActiveId(sorted[0].target.id);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-100px 0px -70% 0px", // Offset for top nav bar and viewport center focus
    });

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-4 sticky">
      <div className="relative border-l border-zinc-900 ml-1 py-1 space-y-3.5">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                "block font-mono text-[11px] font-medium tracking-wide transition-all duration-normal border-l-2 -ml-px pl-4 hover:text-white leading-relaxed",
                heading.level === 3 ? "pl-8 text-[10px]" : "",
                isActive
                  ? "text-primary border-primary font-bold"
                  : "text-zinc-500 border-transparent"
              )}
            >
              {heading.text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
