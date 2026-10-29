"use client";

import { memo, type PointerEvent, type ReactNode } from "react";
import * as motion from "motion/react-client";
import { useMotionTemplate, useReducedMotion, useSpring } from "motion/react";
import { cn } from "cn";
import { Card } from "./card";

export type BorderHighlightProps = {
  children?: ReactNode;
  className?: string;
};

export const BorderHighlight = memo(function BorderHighlight({
  children = (
    <Card
      title="Follow the edge"
      description="Move your pointer around this card to reveal a glowing border."
      className="max-w-none border-0 bg-transparent shadow-none"
    />
  ),
  className,
}: BorderHighlightProps = {}) {
  const reducedMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const mask = useMotionTemplate`radial-gradient(circle 180px at ${x}px ${y}px, black 20%, transparent 100%)`;

  function trackPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = event.clientX - bounds.left;
    const nextY = event.clientY - bounds.top;
    if (event.type === "pointerenter" || reducedMotion) {
      x.jump(nextX);
      y.jump(nextY);
    } else {
      x.set(nextX);
      y.set(nextY);
    }
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      onPointerEnter={trackPointer}
      onPointerMove={trackPointer}
      className={cn(
        "relative w-96 max-w-full min-w-0 border border-border bg-card p-3 text-card-foreground transition-colors hover:border-border/20 focus-within:border-primary/50 motion-reduce:transition-none md:p-4",
        className,
      )}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] border-2 border-primary shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_25%,transparent)]"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: reducedMotion ? 0 : 0.2 }}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      />
    </motion.div>
  );
});
