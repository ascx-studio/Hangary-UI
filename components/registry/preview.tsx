import Card from "@/components/ui/Card";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import Container from "@/components/layout/Container";

type PreviewProps = ComponentProps<typeof Card>;

export default function Preview({ children, className, ...props }: PreviewProps) {
  return (
    <Container
      aria-label="Component preview"
      className={cn("mx-auto flex flex-col min-h-48 bg-muted/5 w-full items-center justify-center overflow-hidden ", className)}
      {...props}
    >
      {children}
    </Container>
  );
}
