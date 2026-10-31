import { memo, type ComponentProps, type ReactNode } from "react";
import { AspectRatio } from "@/hangry/components/aspect-ratio";
import { Card } from "@/hangry/components/card";
import { Scales } from "@/hangry/components/scales";

interface ScaleCardProps extends ComponentProps<"div"> {
  src?: string;
  alt?: string;
  size?: number;
  children?: ReactNode;
}

export const ScaleCard = memo(function ScaleCard({
  src = "/1.webp",
  alt = "Glowing white butterflies on a dark background",
  size = 8,
  children,
  className = "",
  ...props
}: ScaleCardProps = {}) {
  return (
    <div className={`relative mx-auto w-72 max-w-full ${className}`} {...props}>
      <div className="pointer-events-none absolute inset-y-[-30%] -left-10 w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={size} orientation="vertical" />
      </div>
      <div className="pointer-events-none absolute inset-y-[-30%] -right-10 w-8 mask-t-from-90% mask-b-from-90%">
        <Scales size={size} orientation="vertical" />
      </div>
      <div className="pointer-events-none absolute inset-x-[-30%] -top-10 h-8 mask-r-from-90% mask-l-from-90%">
        <Scales size={size} />
      </div>
      <div className="pointer-events-none absolute inset-x-[-30%] -bottom-10 h-8 mask-r-from-90% mask-l-from-90%">
        <Scales size={size} />
      </div>
      <Card title="" description="" className="relative z-10 max-w-none overflow-hidden p-0!">
        <AspectRatio ratio={9 / 10}>
          {children ?? (
            // A native image keeps this registry component framework-independent.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              width={288}
              height={320}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          )}
        </AspectRatio>
      </Card>
    </div>
  );
});
