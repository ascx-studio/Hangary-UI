"use client";

import { memo } from "react";
import { WordmarkShader, type WordmarkSourceProps } from "@/hangry/shader/wordmark-shader.shared";
import lightRayShader from "@/hangry/shader/wordmark-light-ray.wgsl";

const surface = { size: [1337, 336] as const };
const uniforms = (time: number, x: number, y: number, hovering: boolean) => ({
  cfg: { ray: [x * 1337, y * 336, time, Number(hovering)] },
});

export const WordmarkLightRay = memo(function WordmarkLightRay(props: WordmarkSourceProps = {}) {
  return (
    <WordmarkShader
      {...props}
      shader={lightRayShader}
      label="wordmark-light-ray"
      uniforms={uniforms}
      surface={surface}
      baseBrightness={0.25}
    />
  );
});
