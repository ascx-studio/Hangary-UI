"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Toc, type TocItem } from "@/hangry/components/toc";

const DocsToc = memo(function DocsToc() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const article = rootRef.current?.closest("article");
    if (!article) return;

    const ids = new Set<string>();
    const sections = Array.from(
      article.querySelectorAll<HTMLElement>("h1, h2, h3, h4, [data-slot=component-preview]"),
    ).filter(
      (section) =>
        section.matches("[data-slot=component-preview]") ||
        !section.closest("[data-slot=component-preview]"),
    );
    setItems(
      sections.map((section) => {
        const isPreview = section.matches("[data-slot=component-preview]");
        const base =
          section.id ||
          (isPreview ? "preview" : section.innerText)
            .toLowerCase()
            .trim()
            .replace(/[^\p{L}\p{N}\s-]/gu, "")
            .replace(/\s+/g, "-");
        let id = base;
        let suffix = 1;
        while (ids.has(id)) id = `${base}-${suffix++}`;
        ids.add(id);
        section.id = id;
        return {
          id,
          label: isPreview ? "Preview" : section.innerText,
          level: isPreview
            ? 2
            : (Math.min(3, Math.max(1, Number(section.tagName.slice(1)))) as TocItem["level"]),
        };
      }),
    );
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {items.length > 0 && (
        <Toc
          items={items}
          title="On this page"
          className="!fixed right-6 top-1/2 z-40 flex -translate-y-1/2"
        />
      )}
    </div>
  );
});

export default DocsToc;
