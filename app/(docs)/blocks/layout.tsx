import type { ReactNode } from "react";
import RegistrySidebarLayout from "@/components/layout/RegistrySidebarLayout";

export default function BlocksLayout({ children }: { children: ReactNode }) {
  return <RegistrySidebarLayout category="blocks">{children}</RegistrySidebarLayout>;
}
