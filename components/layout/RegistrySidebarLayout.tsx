import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import type { RegistryCategory } from "@/lib/registry";

export default function RegistrySidebarLayout({ children, category }: { children: ReactNode; category: RegistryCategory }) {
  return (
    <div data-sidebar-layout className="md:flex">
      <Sidebar category={category} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
