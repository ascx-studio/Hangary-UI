"use client";

import { Children, memo, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";

const DocsReveal = memo(function DocsReveal({ children, stagger = false }: { children: ReactNode; stagger?: boolean }) {
  const reducedMotion = useReducedMotion();

  if (stagger) {
    return <div>{Children.toArray(children).map((child, index) => (
      <motion.div key={index}
        initial={reducedMotion ? false : { opacity: 1, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      >{child}</motion.div>
    ))}</div>;
  }

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 1, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
});

export default DocsReveal;
