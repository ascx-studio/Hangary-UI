"use client";

import { memo } from "react";
import { WordmarkShader } from "./wordmark-shader.shared";
import lightRayShader from "./wordmark-light-ray.wgsl";

const surface = { size: [1337, 336] as const };
const uniforms = (time: number, x: number, y: number, hovering: boolean) => ({
  cfg: { ray: [x * 1337, y * 336, time, Number(hovering)] },
});

export const WordmarkLightRay = memo(function WordmarkLightRay() {
  return (
    <WordmarkShader
      shader={lightRayShader}
      label="wordmark-light-ray"
      uniforms={uniforms}
      surface={surface}
    />
  );
});
