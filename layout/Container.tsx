import { cn } from "@/utils/cn";
import React from "react";

export default function Container({
                                      children,
                                      className,

                                  }: Readonly<{ children: React.ReactNode, className?: string }>) {
  return (
    <section
      className={cn(
        "flex w-full max-w-6xl mx-auto flex-col px-6 md:px-10",
        className,
      )}
    >
      {children}
    </section>
  );
}
