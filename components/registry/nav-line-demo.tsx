"use client";

import { useId, useRef } from "react";
import { NavLine } from "@/registry/components/nav-line";

const sections = [
  { label: "Overview", description: "A compact rail that follows your position as you scroll." },
  { label: "Installation", description: "Install the component from the registry and pass your section IDs." },
  { label: "Usage", description: "Click a dash to scroll here. Hover or focus it to see a preview." },
  { label: "Customization", description: "Use links, pin an active item, or track an embedded scroll area." },
];

export default function NavLineDemo() {
  const root = useRef<HTMLDivElement>(null);
  const prefix = useId();
  const items = sections.map((section, index) => ({
    id: `${prefix}-section-${index}`,
    label: section.label,
    card: { title: section.label, description: section.description },
  }));

  return (
    <div className="relative h-96 w-full max-w-2xl border border-border bg-background">
      <NavLine items={items} variant="contained" scrollRootRef={root} />
      <div ref={root} className="h-full overflow-y-auto overscroll-contain">
        {sections.map((section, index) => (
          <section key={section.label} id={items[index].id} className="flex min-h-80 flex-col justify-center gap-4 border-b border-border py-10 pl-24 pr-6 last:border-0">
            <span className="text-xs text-muted-foreground">0{index + 1}</span>
            <h2 className={"typography-section-title"}>{section.label}</h2>
            <p className={`max-w-sm typography-body`}>{section.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
