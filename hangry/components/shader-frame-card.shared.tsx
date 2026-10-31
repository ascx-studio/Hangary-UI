"use client";

import { memo, type ReactNode } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "cn";
import { Card } from "@/hangry/components/card";

export type ShaderFrameCardProps = Omit<HTMLMotionProps<"div">, "color" | "children"> & {
  frameWidth?: number;
  contentClassName?: string;
  children?: ReactNode;
};

export const ShaderFrameCard = memo(function ShaderFrameCard({
  background,
  slot,
  frameWidth = 12,
  contentClassName,
  children,
  className,
  style,
  ...props
}: ShaderFrameCardProps & { background: ReactNode; slot: string }) {
  const reducedMotion = useReducedMotion();
  const inset = Number.isFinite(frameWidth) ? Math.max(0, frameWidth) : 12;
  return (
    <motion.div
      {...props}
      data-slot={slot}
      initial={reducedMotion ? false : { opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reducedMotion ? undefined : { y: -3 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.2, ease: "easeOut", y: { type: "spring", stiffness: 220, damping: 26 } }
      }
      className={cn(
        "relative isolate w-full min-w-0 max-w-md overflow-hidden rounded-xl bg-card",
        className,
      )}
      style={{ padding: inset, ...style }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        initial={reducedMotion ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
        transition={
          reducedMotion ? { duration: 0 } : { delay: 0.2, duration: 0.55, ease: "easeInOut" }
        }
        style={{
          padding: inset,
          maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
          maskClip: "content-box, border-box",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      >
        {background}
      </motion.div>
      <motion.div
        className="relative min-w-0"
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion ? { duration: 0 } : { delay: 0.8, duration: 0.3, ease: "easeOut" }
        }
      >
        <Card
          className={cn(
            "relative max-w-none bg-card text-card-foreground ring-0",
            contentClassName,
          )}
        >
          {children}
        </Card>
      </motion.div>
    </motion.div>
  );
});
