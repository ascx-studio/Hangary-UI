import { memo, type ComponentProps } from "react";
import { cn } from "cn";
import { Card } from "@/hangry/components/card";

interface BracketCardProps extends ComponentProps<"div"> {
  variant?: "brackets" | "corners";
}

export const BracketCard = memo(function BracketCard({
  children,
  className,
  variant = "brackets",
  ...props
}: BracketCardProps = {}) {
  return (
    <div
      data-slot="bracket-card"
      className={cn("relative min-w-0 w-full p-2", className)}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-foreground/70">
        <>
          <span
            className={cn(
              "absolute left-0 top-0 border-l border-t border-current",
              variant === "corners" ? "size-8" : "size-6 border-l-2 border-t-2",
            )}
          />
          <span
            className={cn(
              "absolute right-0 top-0 border-r border-t border-current",
              variant === "corners" ? "size-8" : "size-6 border-r-2 border-t-2",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 border-b border-l border-current",
              variant === "corners" ? "size-8" : "size-6 border-b-2 border-l-2",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 right-0 border-b border-r border-current",
              variant === "corners" ? "size-8" : "size-6 border-b-2 border-r-2",
            )}
          />
        </>
      </div>
      <Card
        title=""
        description=""
        className={cn(
          "w-full! max-w-none! bg-background! p-6! sm:p-8!",
          variant === "brackets" ? "border-dashed" : "border-transparent!",
        )}
      >
        {children}
      </Card>
    </div>
  );
});
