"use client";

import { memo, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";

const SharedPreviewLayout = memo(function SharedPreviewLayout({
  children,
  layoutId,
  className,
  dataSlot,
}: {
  children: ReactNode;
  layoutId?: string;
  className?: string;
  dataSlot?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={layoutId}
      transition={{ layout: { duration: reducedMotion ? 0 : 0.45, ease: "easeInOut" } }}
      data-slot={dataSlot}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default SharedPreviewLayout;
