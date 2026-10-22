"use client";

import { memo, type PointerEvent } from "react";
import Image from "next/image";
import * as motion from 'motion/react-client';
import { useMotionTemplate, useReducedMotion, useSpring } from "motion/react";
import { cn } from "cn";

export type SpotlightRevealProps = {
  src?: string;
  /** Choose filled artwork or an outline-only variation. */
  variant?: "default" | "stroke";
  /** Outline artwork matching src. Defaults to the local outlined wordmark. */
  strokeSrc?: string;
  alt?: string;
  className?: string;
};

export const SpotlightReveal = memo(function SpotlightReveal({
  src = "/wordmark.svg",
  variant = "default",
  strokeSrc = "/wordmark-stroke.svg",
  alt = "",
  className,
}: SpotlightRevealProps = {}) {
  const reducedMotion = useReducedMotion();
  const artwork = variant === "stroke" ? strokeSrc : src;
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const mask = useMotionTemplate`radial-gradient(circle 120px at ${x}px ${y}px, black 20%, transparent 100%)`;

  function trackPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = event.clientX - bounds.left;
    const nextY = event.clientY - bounds.top;
    if (event.type === "pointerenter") {
      x.jump(nextX);
      y.jump(nextY);
    } else {
      x.set(nextX);
      y.set(nextY);
    }
  }

  return (
    <motion.div
      className={cn("group/spotlight relative h-64 w-[640px] max-w-full overflow-hidden", className)}
      initial="rest"
      whileHover={reducedMotion ? undefined : "hover"}
      onPointerEnter={trackPointer}
      onPointerMove={trackPointer}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        variants={{ rest: { opacity: 0.5 }, hover: { opacity: 0.12 } }}
        transition={{ duration: reducedMotion ? 0 : 0.25 }}
      >
        <Image src={artwork} fill unoptimized sizes="(max-width: 896px) 100vw, 896px" alt={alt}
          className="select-none object-contain" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: reducedMotion ? 0 : 0.25 }}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        <Image src={artwork} fill unoptimized sizes="640px" alt="" className="select-none object-contain" />
      </motion.div>
    </motion.div>
  );
});
