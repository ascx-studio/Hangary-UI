import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import {Container} from "@/components/cards/card-9"


export default function ComponentPreview({ children, className, ...props }: ComponentProps<"section">) {
  return (
    <Container className="mb-10">
      <section
        data-slot="component-preview"
        aria-label="Component preview"
        className={cn(
          "flex min-h-[85dvh]  w-full flex-col overflow-auto p-4 sm:p-6 mx-auto justify-center",
          className,
        )}
        {...props}
      >
        {children}
      </section>
    </Container>
  );
}
