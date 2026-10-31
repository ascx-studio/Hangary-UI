import { memo, type ComponentProps } from "react";
import { cn } from "cn";

export type GradientGridBackgroundProps = ComponentProps<"div">;

export const GradientGridBackground = memo(function GradientGridBackground({
  className,
  children,
  ...props
}: GradientGridBackgroundProps = {}) {
  return (
    <div
      {...props}
      data-slot="gradient-grid-background"
      className={cn(
        " relative isolate min-h-96 overflow-hidden border border-border bg-linear-to-b from-sky-50 via-sky-100 to-sky-200 dark:from-sky-50 dark:via-sky-200 dark:to-blue-950",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(13,42,86,0.8)_2px,transparent_2px),linear-gradient(to_bottom,rgba(13,42,86,0.8)_2px,transparent_2px)] bg-size-[24px_24px] opacity-20 dark:opacity-100"
      />
      {children}
    </div>
  );
});
