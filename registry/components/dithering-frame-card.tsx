import { memo } from "react";
import { CardDescription, CardHeader, CardTitle } from "./card";
import { ShaderFrameCard, type ShaderFrameCardProps } from "./shader-frame-card.shared";
import { DitherBackground, type DitherBackgroundProps } from "../shader/dither-background";

type DitheringFrameCardProps = ShaderFrameCardProps &
  Pick<DitherBackgroundProps, "color" | "backgroundColor" | "pixelSize" | "speed">;

export const DitheringFrameCard = memo(function DitheringFrameCard({
  color,
  backgroundColor,
  pixelSize,
  speed,
  children = <CardHeader>
    <CardTitle>A different kind of frame.</CardTitle>
    <CardDescription>Flowing pixels around a quiet space for your next idea.</CardDescription>
  </CardHeader>,
  ...props
}: DitheringFrameCardProps = {}) {
  return <ShaderFrameCard {...props} slot="dithering-frame-card" background={
    <DitherBackground interactive={false} color={color} backgroundColor={backgroundColor} pixelSize={pixelSize} speed={speed} className="absolute inset-0 h-full min-h-0 w-full border-0" />
  }>{children}</ShaderFrameCard>;
});
