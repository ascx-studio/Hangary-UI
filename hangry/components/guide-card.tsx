import { memo, type ComponentProps } from "react";
import { cn } from "cn";

const tracks = "calc(var(--guide-inset) - 12px) minmax(0, 1fr) calc(var(--guide-inset) - 12px)";
const lines = [
  { position: "inset-x-0 top-[var(--guide-inset)]", vertical: false },
  { position: "inset-x-0 bottom-[var(--guide-inset)]", vertical: false },
  { position: "inset-y-0 left-[var(--guide-inset)]", vertical: true },
  { position: "inset-y-0 right-[var(--guide-inset)]", vertical: true },
];
const corners = [
  "left-[var(--guide-inset)] top-[var(--guide-inset)] -translate-x-1/2 -translate-y-1/2",
  "right-[var(--guide-inset)] top-[var(--guide-inset)] translate-x-1/2 -translate-y-1/2",
  "left-[var(--guide-inset)] bottom-[var(--guide-inset)] -translate-x-1/2 translate-y-1/2",
  "right-[var(--guide-inset)] bottom-[var(--guide-inset)] translate-x-1/2 translate-y-1/2",
];

export const GuideCard = memo(function GuideCard({
  children,
  className,
  ...props
}: ComponentProps<"div"> = {}) {
  return (
    <div
      data-slot="guide-card"
      className={cn(
        "relative isolate min-w-0 w-full [--guide-inset:2rem] sm:[--guide-inset:3rem]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-muted-foreground/40"
      >
        {lines.map(({ position, vertical }) => (
          <div
            key={position}
            className={`absolute grid gap-6 ${vertical ? "w-px" : "h-px"} ${position}`}
            style={vertical ? { gridTemplateRows: tracks } : { gridTemplateColumns: tracks }}
          >
            <span className="bg-border" />
            <span className="bg-border" />
            <span className="bg-border" />
          </div>
        ))}
        {corners.map((position) => (
          <svg
            key={position}
            viewBox="0 0 24 24"
            fill="none"
            className={`absolute size-6 ${position}`}
          >
            <path
              d="M5 12H19M12 5V19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </div>
      <div className="relative min-w-0 p-12 sm:p-16">{children}</div>
    </div>
  );
});
