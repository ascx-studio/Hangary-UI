import { memo, type ComponentProps } from "react";
import { cn } from "cn";
import { Card } from "./card";
import { AspectRatio } from "./aspect-ratio";

interface StripedCardProps extends ComponentProps<"div"> {
  src?: string;
  alt?: string;
}

const stripes = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, transparent 0 5px, var(--border) 5px 7px, transparent 7px 10px)",
};

export const StripedCard = memo(function StripedCard({
  src = "/1.png",
  alt = "Glowing white butterflies on a dark background",
  children,
  className,
  ...props
}: StripedCardProps = {}) {
  return (
    <div
      data-slot="striped-card"
      className={cn("relative mx-auto min-w-0 w-72 max-w-full", className)}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          style={stripes}
          className="absolute inset-y-[-30%] -left-10 w-8 mask-t-from-90% mask-b-from-90%"
        />
        <div
          style={stripes}
          className="absolute inset-y-[-30%] -right-10 w-8 mask-t-from-90% mask-b-from-90%"
        />
        <div
          style={stripes}
          className="absolute inset-x-[-30%] -top-10 h-8 mask-r-from-90% mask-l-from-90%"
        />
        <div
          style={stripes}
          className="absolute inset-x-[-30%] -bottom-10 h-8 mask-r-from-90% mask-l-from-90%"
        />
      </div>
      <Card title="" description="" className="relative w-full! max-w-none! overflow-hidden p-0!">
        <AspectRatio ratio={9 / 10}>
          {children ?? (
            // A native image keeps the component framework-independent.
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
