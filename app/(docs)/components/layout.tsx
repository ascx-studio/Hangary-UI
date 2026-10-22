import type { ReactNode } from "react";
import SidebarPageLayout from "@/components/layout/sidebar-page-layout";

export default function ComponentsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarPageLayout category="components" className="min-h-dvh md:flex" contentClassName="w-full min-w-0 flex-1 bg-background" sidebarClassName="sticky">
      {children}
    </SidebarPageLayout>
  );
}
