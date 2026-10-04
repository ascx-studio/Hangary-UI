import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export default function ComponentPreview({ children, className, ...props }: ComponentProps<"section">) {
  return (
    <section data-slot="component-preview" aria-label="Component preview" className={cn("flex min-h-[85dvh] border-4 mb-4 rounded-lg  w-full flex-col mx-auto justify-center overflow-auto p-4 sm:p-6", className)} {...props}>
      {children}
    </section>
  );
}
