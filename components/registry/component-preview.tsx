import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/cards/card-9";

export default function ComponentPreview({ children, className, ...props }: ComponentProps<"section">) {
  return (
    <Container data-slot="component-preview" className="mx-auto mb-10 max-w-7xl">
      <section
        aria-label="Component preview"
        className={cn(
          "mx-auto grid min-h-[70dvh] min-w-0 w-full max-w-full flex-1 place-items-center overflow-auto *:m-4 *:min-w-0 *:max-w-[calc(100%-2rem)]",
          className,
        )}
        {...props}
      >
        {children}
      </section>
    </Container>
  );
}
