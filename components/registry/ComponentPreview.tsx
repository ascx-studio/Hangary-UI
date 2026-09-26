import Card from "@/components/ui/Card";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

type ComponentPreviewProps = ComponentProps<typeof Card>;

export default function ComponentPreview({ children, className, ...props }: ComponentPreviewProps) {

  return (
    <Card
      aria-label="Component preview"
      className={cn("mx-auto flex min-h-80 w-full items-center justify-center overflow-x-auto rounded-xl border bg-muted/10 p-6 md:min-h-112 md:p-10", className)}
      {...props}
    >
      {children}
    </Card>
  );
}
