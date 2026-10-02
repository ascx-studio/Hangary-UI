import type { ReactNode } from "react";
import RegistrySidebarLayout from "@/components/layout/RegistrySidebarLayout";

export default function ComponentDetailLayout({ children }: { children: ReactNode }) {
  return <RegistrySidebarLayout category="components">{children}</RegistrySidebarLayout>;
}
