import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-0 w-full flex-1 bg-background">
      <a href="#docs-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-3 focus:text-foreground">Skip to content</a>
      <main id="docs-content" tabIndex={-1} className="min-w-0 py-6 focus:outline-none md:py-8 [&:has([data-sidebar-layout])]:py-0">{children}</main>
    </div>
  );
}
