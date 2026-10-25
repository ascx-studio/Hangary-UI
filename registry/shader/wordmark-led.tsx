"use client";

import { memo } from "react";
import { WordmarkShader } from "./wordmark-shader.shared";
import wordmarkLedShader from "./wordmark-led.wgsl";

const surface = { dpr: [1, 2] as const };
const uniforms = (time: number, x: number, y: number, hovering: boolean) => ({
  params: { time: [time, x, y, Number(hovering)] },
});

export const WordmarkLed = memo(function WordmarkLed() {
  return <WordmarkShader shader={wordmarkLedShader} label="wordmark-led" uniforms={uniforms} surface={surface} screenBlend />;
});
