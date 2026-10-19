"use client";

import { memo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";

let skipSharedLayout = false;
let initialized = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (!initialized && typeof window !== "undefined") {
    const notify = (skip: boolean) => {
      skipSharedLayout = skip;
      listeners.forEach((subscriber) => subscriber());
    };
    window.addEventListener("popstate", () => notify(true));
    document.addEventListener("click", (event) => {
      if ((event.target as Element | null)?.closest("a[href]")) notify(false);
    }, true);
    initialized = true;
  }

  return () => listeners.delete(listener);
}

function getSnapshot() {
  return skipSharedLayout;
}

function getServerSnapshot() {
  return false;
}

const SharedPreviewLayout = memo(function SharedPreviewLayout({
  children,
  layoutId,
  className,
  dataSlot,
  retireLayoutIdAfterAnimation = false,
}: {
  children: ReactNode;
  layoutId?: string;
  className?: string;
  dataSlot?: string;
  retireLayoutIdAfterAnimation?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const skipLayout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [layoutSettled, setLayoutSettled] = useState(false);
  const activeLayoutId = skipLayout || (retireLayoutIdAfterAnimation && layoutSettled) ? undefined : layoutId;

  return (
    <motion.div
      layoutId={activeLayoutId}
      onLayoutAnimationComplete={retireLayoutIdAfterAnimation ? () => setLayoutSettled(true) : undefined}
      transition={{ layout: { duration: reducedMotion ? 0 : 0.45, ease: "easeInOut" } }}
      data-slot={dataSlot}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default SharedPreviewLayout;
