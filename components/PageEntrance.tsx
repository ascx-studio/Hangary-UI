import type { ReactNode } from "react";
import * as motion from "motion/react-client";

export default function PageEntrance({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="w-full min-w-0 motion-reduce:opacity-100!"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
