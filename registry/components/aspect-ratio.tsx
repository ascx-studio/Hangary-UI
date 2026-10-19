import { memo, type ComponentProps, type CSSProperties } from "react";
import { cn } from "cn";

interface AspectRatioProps extends ComponentProps<"div"> {
  ratio?: number;
}

export const AspectRatio = memo(function AspectRatio({
  ratio = 1,
  className,
  style,
  ...props
}: AspectRatioProps = {}) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ "--ratio": ratio, ...style } as CSSProperties}
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  );
});
