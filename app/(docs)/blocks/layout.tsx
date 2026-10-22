import type { ReactNode } from "react";
import SidebarPageLayout from "@/components/layout/sidebar-page-layout";

export default function BlocksLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarPageLayout category="blocks" className="min-h-dvh md:flex" contentClassName="w-full min-w-0 flex-1 bg-background" sidebarClassName="sticky">
      {children}
    </SidebarPageLayout>
  );
}
