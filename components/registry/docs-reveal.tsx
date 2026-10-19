"use client";

import { memo, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";

const DocsReveal = memo(function DocsReveal({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
});

export default DocsReveal;
