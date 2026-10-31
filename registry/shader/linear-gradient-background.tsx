import { memo, type ComponentProps } from "react";
import { cn } from "cn";

export type LinearGradientBackgroundProps = ComponentProps<"div">;

export const LinearGradientBackground = memo(function LinearGradientBackground({
  className,
  children,
  ...props
}: LinearGradientBackgroundProps = {}) {
  return (
    <div
      {...props}
      data-slot="linear-gradient-background"
      className={cn(
        "hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-background",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-emerald-50 to-emerald-200 dark:from-emerald-950 dark:to-emerald-400"
      />
      {children}
    </div>
  );
});
