import { memo } from "react";
import { LightBackground, type LightBackgroundProps } from "@/hangry/shader/light-background.shared";

export type LightRayBackgroundProps = LightBackgroundProps;

export const LightRayBackground = memo(function LightRayBackground({
  intensity = 1,
  speed = 0.1,
  ...props
}: LightRayBackgroundProps = {}) {
  return <LightBackground {...props} intensity={intensity} speed={speed} variant="light-ray" />;
});
