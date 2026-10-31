import { memo } from "react";
import { LightBackground, type LightBackgroundProps } from "./light-background.shared";

export type LedBackgroundProps = LightBackgroundProps;

export const LedBackground = memo(function LedBackground(props: LedBackgroundProps = {}) {
  return <LightBackground {...props} variant="led" />;
});
