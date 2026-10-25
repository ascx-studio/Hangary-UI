import { memo, type ComponentProps } from "react";
import { cn } from "cn";

const FrameCorners = memo(function FrameCorners() {
  const dot = "size-1 rounded-full bg-foreground outline outline-8 outline-background my-4 sm:my-6 md:my-8";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 grid grid-cols-2 place-content-between">
      <span className={`${dot} -ml-[2.5px]`} />
      <span className={`${dot} -mr-0.5 place-self-end`} />
      <span className={`${dot} -ml-[2.5px]`} />
      <span className={`${dot} -mr-0.5 place-self-end`} />
    </div>
  );
});

export const FrameCard = memo(function FrameCard({ children, className, ...props }: ComponentProps<"div"> = {}) {
  return (
    <div data-slot="frame-card" {...props} className={cn("relative min-w-0 w-full rounded-lg border border-border px-4 sm:px-6 md:px-8", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-4 z-20 h-px w-full bg-border sm:top-6 md:top-8" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-0 z-20 h-px w-full bg-border sm:bottom-6 md:bottom-8" />
      <div className="relative min-w-0 w-full border-x border-border">
        <FrameCorners />
        <div className="relative z-10 flex min-h-0 min-w-0 w-full flex-col py-8">{children}</div>
      </div>
    </div>
  );
});
