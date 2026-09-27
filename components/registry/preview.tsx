import Card from "@/components/ui/Card";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type PreviewProps = ComponentProps<typeof Card>;

export default function Preview({ children, className, ...props }: PreviewProps) {
  return (
    <Card
      aria-label="Component preview"
      className={cn("mx-auto flex min-h-48 w-full items-center justify-center overflow-x-auto rounded-xl border bg-muted/10 p-4 sm:p-6", className)}
      {...props}
    >
      {children}
    </Card>
  );
}
