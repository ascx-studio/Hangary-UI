"use client";

import { memo, useState, type ReactNode } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { Card } from "@/hangry/components/card";
import { Button } from "@/hangry/components/button";

export interface CardStackItem {
  id: string;
  title: string;
  description?: string;
  src?: string;
  alt?: string;
  children?: ReactNode;
}

interface CardStackProps {
  items?: readonly CardStackItem[];
  className?: string;
  label?: string;
}

const defaultItems: readonly CardStackItem[] = [
  {
    id: "front",
    title: "A little depth. A different perspective.",
    description: "A simple stack for your next idea.",
    src: "/1.webp",
    alt: "Glowing white butterflies on black",
  },
  {
    id: "middle",
    title: "The next layer",
    description: "A different view, just beneath the surface.",
    src: "/2.webp",
    alt: "White light swirling around a dark center",
  },
  {
    id: "back",
    title: "Room for more",
    description: "There is always another perspective to explore.",
    src: "/3.webp",
    alt: "A monochrome field of stars and clouds",
  },
];

export const CardStack = memo(function CardStack({
  items = defaultItems,
  className = "",
  label = "Card stack",
}: CardStackProps = {}) {
  const reducedMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cards = items.slice(0, 3);
  const selected = cards.find((item) => item.id === selectedId) ?? cards[0];
  if (!selected) return null;
  const ordered = [selected, ...cards.filter((item) => item.id !== selected.id)];

  return (
    <section aria-label={label} className={`w-full max-w-2xl pt-10 ${className}`}>
      <div className="relative isolate">
        {ordered.map((item, depth) => (
          <motion.div
            layout={!reducedMotion}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            key={item.id}
            style={{
              zIndex: 3 - depth,
              top: depth === 0 ? undefined : -depth * 20,
              left: depth === 0 ? undefined : `${depth * 2.5}%`,
              right: depth === 0 ? undefined : `${depth * 2.5}%`,
            }}
            className={depth === 0 ? "relative" : "absolute bottom-0"}
          >
            <Card
              title=""
              description=""
              className="relative h-full w-full! max-w-none! overflow-hidden p-0!"
            >
              <Button
                variant="ghost"
                aria-label={`Show ${item.title}`}
                aria-pressed={depth === 0}
                onClick={() => setSelectedId(item.id)}
                className="absolute inset-x-0 top-0 z-10 h-5! min-h-0! w-full p-0! hover:bg-muted focus-visible:outline-offset-[-2px]"
              />
              {depth === 0 && (
                <motion.div
                  initial={{ opacity: reducedMotion ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.2 }}
                  className="p-6 sm:p-10"
                >
                  <div className="mb-6 h-0.5 w-16 bg-primary" />
                  <h3 className={`typography-section-title text-card-foreground!`}>{item.title}</h3>
                  {item.description && (
                    <p className={`mt-3 typography-body text-muted-foreground!`}>{item.description}</p>
                  )}
                  {item.children ??
                    (item.src && (
                      // A native image keeps the registry component framework-independent.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.src}
                        alt={item.alt ?? ""}
                        width={640}
                        height={320}
                        loading="lazy"
                        decoding="async"
                        className="mt-8 aspect-[2/1] w-full object-cover"
                      />
                    ))}
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
