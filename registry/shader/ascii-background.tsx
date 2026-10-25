import { memo } from "react";
import { ProceduralBackground, type ProceduralBackgroundProps } from "./procedural-background.shared";

export interface AsciiBackgroundProps extends ProceduralBackgroundProps {
  cellSize?: number;
}

export const AsciiBackground = memo(function AsciiBackground({ cellSize = 14, ...props }: AsciiBackgroundProps = {}) {
  const value = Number.isFinite(cellSize) ? Math.max(7, Math.min(40, cellSize)) : 14;
  return <ProceduralBackground {...props} variant="ascii" settings={[value, 0]} />;
});
