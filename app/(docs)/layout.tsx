import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-0 w-full flex-1 bg-background">
      <main id="docs-content" tabIndex={-1} className="min-w-0 py-6 focus:outline-none md:py-8 [&:has([data-sidebar-layout])]:py-0">{children}</main>
    </div>
  );
}
