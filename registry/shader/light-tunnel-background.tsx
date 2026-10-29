import { memo } from "react";
import {
  ProceduralBackground,
  type ProceduralBackgroundProps,
} from "./procedural-background.shared";

export interface LightTunnelBackgroundProps extends ProceduralBackgroundProps {
  rings?: number;
}

export const LightTunnelBackground = memo(function LightTunnelBackground({
  rings = 5,
  ...props
}: LightTunnelBackgroundProps = {}) {
  const value = Number.isFinite(rings) ? Math.max(2, Math.min(12, rings)) : 5;
  return <ProceduralBackground {...props} variant="light-tunnel" settings={[value, 0]} />;
});
