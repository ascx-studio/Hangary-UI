"use client";

import { memo, type ReactNode } from "react";
import { LayoutGroup, useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";
import Sidebar from "@/components/Sidebar";
import type { RegistryCategory } from "@/lib/registry";

const SidebarPageLayout = memo(function SidebarPageLayout({
  children,
  category,
  className = "md:flex",
  contentClassName = "min-w-0 flex-1",
  sidebarClassName,
}: {
  children: ReactNode;
  category: RegistryCategory;
  className?: string;
  contentClassName?: string;
  sidebarClassName?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <LayoutGroup id="documentation-sidebar-layout">
      <div data-sidebar-layout className={className}>
        <Sidebar category={category} className={sidebarClassName} />
        <motion.div
          layout
          transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeInOut" }}
          className={contentClassName}
        >
          {children}
        </motion.div>
      </div>
    </LayoutGroup>
  );
});

export default SidebarPageLayout;
