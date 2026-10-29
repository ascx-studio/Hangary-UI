import { memo } from "react";
import {
  ProceduralBackground,
  type ProceduralBackgroundProps,
} from "./procedural-background.shared";

export interface ChromaBackgroundProps extends ProceduralBackgroundProps {
  hueShift?: number;
  grain?: number;
}

export const ChromaBackground = memo(function ChromaBackground({
  hueShift = 0,
  grain = 0.035,
  ...props
}: ChromaBackgroundProps = {}) {
  const hue = Number.isFinite(hueShift) ? (hueShift * Math.PI) / 180 : 0;
  const texture = Number.isFinite(grain) ? Math.max(0, Math.min(0.2, grain)) : 0.035;
  return <ProceduralBackground {...props} variant="chroma" settings={[hue, texture]} />;
});
