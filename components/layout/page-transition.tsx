"use client";

import { memo, ViewTransition, type ReactNode } from "react";

const PageTransition = memo(function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition name="page" default="none" update="page-rise">
      <div className="flex min-h-0 w-full flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
});

export default PageTransition;
