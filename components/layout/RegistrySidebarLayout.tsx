import type { ReactNode } from "react";
import SidebarPageLayout from "@/components/layout/sidebar-page-layout";
import type { RegistryCategory } from "@/lib/registry";

export default function RegistrySidebarLayout({ children, category }: Readonly<{ children: ReactNode; category: RegistryCategory }>) {
  return (
    <SidebarPageLayout category={category} className="md:flex">
      {children}
    </SidebarPageLayout>
  );
}
