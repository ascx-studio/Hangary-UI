"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/cards/card-9";
import { usePathname } from "next/navigation";
import SharedPreviewLayout from "@/components/registry/shared-preview-layout";

type ComponentPreviewProps = ComponentProps<"section"> & { fullBleed?: boolean };

export default function ComponentPreview({ children, className, fullBleed = false, ...props }: ComponentPreviewProps) {
  const pathname = usePathname();
  const [category, name] = pathname.split("/").filter(Boolean).slice(-2);
  const layoutId = category === "components" && name ? `catalog-preview-${category}-${name}` : undefined;

  if (fullBleed) {
    return (
      <SharedPreviewLayout layoutId={layoutId} dataSlot="component-preview" className="mx-auto mb-10 max-w-7xl">
        <Container className="w-full">
          <section
            {...props}
            aria-label="Component preview"
            className={cn("relative isolate min-h-[80dvh] w-full overflow-hidden [&>*]:absolute [&>*]:inset-0 [&>*]:h-full [&>*]:w-full [&>*]:border-0!", className)}
          >{children}</section>
        </Container>
      </SharedPreviewLayout>
    );
  }

  return (
    <SharedPreviewLayout
      layoutId={layoutId}
      dataSlot="component-preview"
      className="mx-auto mb-10 max-w-7xl"
    >
      <Container className="w-full">
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
    </SharedPreviewLayout>
  );
}
