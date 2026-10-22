"use client";

import { memo, type ReactNode } from "react";
import { LayoutGroup } from "motion/react";
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
  return (
    <LayoutGroup id="documentation-sidebar-layout">
      <div data-sidebar-layout className={className}>
        <Sidebar category={category} className={sidebarClassName} />
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    </LayoutGroup>
  );
});

export default SidebarPageLayout;
