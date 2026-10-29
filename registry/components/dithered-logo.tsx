"use client";

import { memo, useRef, type ComponentProps } from "react";
import { cn } from "cn";
import { AspectRatio } from "./aspect-ratio";
import { DitherBackground, type DitherBackgroundProps } from "../shader/dither-background";

type DitheredLogoProps = Omit<ComponentProps<"div">, "color" | "children"> &
  Pick<DitherBackgroundProps, "color" | "backgroundColor" | "pixelSize" | "speed"> & {
    src?: string;
    alt?: string;
    ratio?: number;
  };

export const DitheredLogo = memo(function DitheredLogo({
  src = "/logo.svg",
  alt = "Hangry UI",
  ratio = 2,
  color,
  backgroundColor,
  pixelSize,
  speed,
  className,
  ...props
}: DitheredLogoProps = {}) {
  const interactionRef = useRef<HTMLDivElement>(null);
  const mask = `url(${JSON.stringify(src)})`;
  return (
    <AspectRatio
      {...props}
      ref={interactionRef}
      ratio={Number.isFinite(ratio) && ratio > 0 ? ratio : 2}
      data-slot="dithered-logo"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("w-full max-w-lg", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: mask,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: mask,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      >
        <DitherBackground
          interactive
          interactionRef={interactionRef}
          color={color}
          backgroundColor={backgroundColor}
          pixelSize={pixelSize}
          speed={speed}
          className="h-full min-h-0 w-full border-0"
        />
      </div>
    </AspectRatio>
  );
});
