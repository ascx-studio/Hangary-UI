import { memo, useId, type ComponentProps } from "react";

interface ScalesProps extends ComponentProps<"svg"> {
  size?: number;
  orientation?: "horizontal" | "vertical";
}

export const Scales = memo(function Scales({
  size = 8,
  orientation = "horizontal",
  className = "",
  ...props
}: ScalesProps = {}) {
  const id = useId();
  const spacing = Number.isFinite(size) && size > 0 ? size : 8;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`h-full w-full text-muted-foreground/40 ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={spacing * 5}
          height="32"
          patternUnits="userSpaceOnUse"
          patternTransform={orientation === "vertical" ? "rotate(90)" : undefined}
        >
          <path
            d={`M0 0V32 M${spacing} 10V22 M${spacing * 2} 10V22 M${spacing * 3} 10V22 M${spacing * 4} 10V22`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
});
