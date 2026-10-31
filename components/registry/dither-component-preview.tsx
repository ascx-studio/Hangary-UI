import { memo, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { DitheringFrameCard } from "@/hangry/components/dithering-frame-card";
import SharedPreviewLayout from "./shared-preview-layout";

type DitherComponentPreviewProps = ComponentProps<"section"> & {
  fullBleed?: boolean;
  frameWidth?: number;
};

const DitherComponentPreview = memo(function DitherComponentPreview({
  children,
  className,
  fullBleed = false,
  frameWidth = 20,
  ...props
}: DitherComponentPreviewProps) {
  return (
    <SharedPreviewLayout dataSlot="component-preview" className="mx-auto mb-10 w-full max-w-7xl">
      <DitheringFrameCard
        frameWidth={frameWidth}
        className="max-w-none"
        contentClassName="overflow-hidden border-0 bg-background p-0 shadow-none"
        whileHover={{ y: 0 }}
      >
        <section
          {...props}
          aria-label={props["aria-label"] ?? "Component preview"}
          className={cn(
            "relative isolate min-w-0 w-full overflow-hidden bg-background",
            fullBleed
              ? "min-h-[80dvh] *:absolute *:inset-0 *:h-full *:w-full *:border-0!"
              : "grid min-h-[70dvh] place-items-center overflow-auto *:m-4 *:min-w-0 *:max-w-[calc(100%-2rem)]",
            className,
          )}
        >
          {children}
        </section>
      </DitheringFrameCard>
    </SharedPreviewLayout>
  );
});

export default DitherComponentPreview;
