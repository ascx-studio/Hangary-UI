import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <div data-sidebar-layout className="min-h-dvh md:flex">
      <Sidebar category="components" className='sticky' />
      <div className="w-full min-w-0 flex-1 bg-neutral-950">{children}</div>
    </div>
  );
}
