import { memo } from "react";
import {
  ProceduralBackground,
  type ProceduralBackgroundProps,
} from "@/hangry/shader/procedural-background.shared";

export interface HeatmapBackgroundProps extends ProceduralBackgroundProps {
  scale?: number;
  colors?: readonly [string, string, string, string, string, string, string];
  lightColors?: readonly [string, string, string, string, string, string, string];
}

const defaultColors = [
  "#112069",
  "#1f3ca3",
  "#3265e7",
  "#6bd8ff",
  "#ffe77a",
  "#ff9a1f",
  "#ff4d00",
] as const;

const defaultLightColors = [
  "#e5f7ff",
  "#86ddff",
  "#25bde3",
  "#285ee8",
  "#ffe04d",
  "#ff8a18",
  "#e74024",
] as const;

export const HeatmapBackground = memo(function HeatmapBackground({
  scale = 1.5,
  colors = defaultColors,
  lightColors = colors === defaultColors ? defaultLightColors : colors,
  ...props
}: HeatmapBackgroundProps = {}) {
  const value = Number.isFinite(scale) ? Math.max(0.25, Math.min(6, scale)) : 1.5;
  const stops = defaultColors.map((fallback, index) =>
    /^#[0-9a-f]{6}$/i.test(colors[index] ?? "") ? colors[index] : fallback,
  );
  const lightStops = defaultLightColors.map((fallback, index) =>
    /^#[0-9a-f]{6}$/i.test(lightColors[index] ?? "") ? lightColors[index] : fallback,
  );
  const palette = Object.fromEntries(
    [...stops, ...lightStops].map((hex, index) => [
      index < 7 ? `color${index}` : `lightColor${index - 7}`,
      [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
        1,
      ],
    ]),
  );
  return (
    <ProceduralBackground
      {...props}
      variant="heatmap"
      settings={[value, 0]}
      palette={palette}
      lightFallback={`linear-gradient(135deg, ${lightStops.join(", ")})`}
      fallback={`linear-gradient(135deg, ${stops.join(", ")})`}
    />
  );
});
