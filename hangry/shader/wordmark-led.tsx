"use client";

import { memo } from "react";
import { WordmarkShader, type WordmarkSourceProps } from "@/hangry/shader/wordmark-shader.shared";
import wordmarkLedShader from "@/hangry/shader/wordmark-led.wgsl";

const surface = { dpr: [1, 2] as const };
const uniforms = (time: number, x: number, y: number, hovering: boolean) => ({
  params: { time: [time, x, y, Number(hovering)] },
});

export const WordmarkLed = memo(function WordmarkLed(props: WordmarkSourceProps = {}) {
  return (
    <WordmarkShader
      {...props}
      shader={wordmarkLedShader}
      label="wordmark-led"
      uniforms={uniforms}
      surface={surface}
    />
  );
});
