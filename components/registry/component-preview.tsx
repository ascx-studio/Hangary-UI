import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export default function ComponentPreview({ children, className, ...props }: ComponentProps<"section">) {
  return (
    <section data-slot="component-preview" aria-label="Component preview" className={cn("flex min-h-[85dvh]  w-full flex-col overflow-auto p-4 sm:p-6", className)} {...props}>
      <div className="my-auto shrink-0" >{children}</div>
    </section>
  );
}
