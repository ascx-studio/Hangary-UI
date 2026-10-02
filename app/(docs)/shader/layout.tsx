import type { ReactNode } from "react";
import RegistrySidebarLayout from "@/components/layout/RegistrySidebarLayout";

export default function ShaderLayout({ children }: { children: ReactNode }) {
  return <RegistrySidebarLayout category="shader">{children}</RegistrySidebarLayout>;
}
