import { memo } from "react";
import { ProceduralBackground, type ProceduralBackgroundProps } from "./procedural-background.shared";

export interface HeatmapBackgroundProps extends ProceduralBackgroundProps {
  scale?: number;
}

export const HeatmapBackground = memo(function HeatmapBackground({ scale = 1.5, ...props }: HeatmapBackgroundProps = {}) {
  const value = Number.isFinite(scale) ? Math.max(0.25, Math.min(6, scale)) : 1.5;
  return <ProceduralBackground {...props} variant="heatmap" settings={[value, 0]} />;
});
