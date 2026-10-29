import { memo } from "react";
import {
  ProceduralBackground,
  type ProceduralBackgroundProps,
} from "./procedural-background.shared";

export interface LiquidChromeBackgroundProps extends ProceduralBackgroundProps {
  scale?: number;
  distortion?: number;
  roughness?: number;
  exposure?: number;
}

export const LiquidChromeBackground = memo(function LiquidChromeBackground({
  scale = 1.6,
  distortion = 0.8,
  roughness = 0.3,
  exposure = 1,
  ...props
}: LiquidChromeBackgroundProps = {}) {
  const zoom = Number.isFinite(scale) ? Math.max(0.5, Math.min(5, scale)) : 1.6;
  const warp = Number.isFinite(distortion) ? Math.max(0, Math.min(2, distortion)) : 0.8;
  const blur = Number.isFinite(roughness) ? Math.max(0, Math.min(1, roughness)) : 0.3;
  const light = Number.isFinite(exposure) ? Math.max(0, Math.min(4, exposure)) : 1;
  return (
    <ProceduralBackground {...props} variant="liquid-chrome" settings={[zoom, warp, blur, light]} />
  );
});
