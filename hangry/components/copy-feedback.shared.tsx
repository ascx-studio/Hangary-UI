"use client";

import { memo } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";

export const CopyFeedback = memo(function CopyFeedback({ copied = false }: { copied?: boolean }) {
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 0.22, ease: "easeInOut" as const };

  return (
    <motion.svg
      aria-hidden="true"
      focusable="false"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M 15 9 L 15 4 L 4 4 L 4 15 L 9 15"
        initial={false}
        animate={{ opacity: copied ? 0 : 1 }}
        transition={transition}
      />
      <motion.path
        initial={false}
        animate={{
          d: copied
            ? "M 5 12 L 9 16 L 12.5 12.5 L 16 9 L 20 5"
            : "M 9 9 L 20 9 L 20 20 L 9 20 L 9 9",
        }}
        transition={transition}
      />
    </motion.svg>
  );
});
