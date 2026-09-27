import React from "react";
import Sidebar from "@/components/Sidebar";
import { getRegistryItems, getRegistryCategory, getRegistryItemHref } from "@/lib/registry";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh w-full bg-background md:flex">
      <a href="#docs-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-3 focus:text-foreground">Skip to content</a>
      <Sidebar items={getRegistryItems().map(item => ({
        label: item.title,
        href: getRegistryItemHref(item),
        category: getRegistryCategory(item),
      }))} />
      <main id="docs-content" tabIndex={-1} className="min-w-0 flex-1 py-6 focus:outline-none md:py-8">{children}</main>
    </div>
  );
}
