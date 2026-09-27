"use client";

import { ShaderCanvas } from "../lib/shader-canvas";

const fragment = `precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec3 tint;

float bayer4(vec2 pixel) {
  vec2 cell = mod(pixel, 4.);
  float low = mod(mod(cell.x, 2.) * 2. + mod(cell.y, 2.) * 3., 4.);
  vec2 highCell = floor(cell / 2.);
  float high = mod(highCell.x * 2. + highCell.y * 3., 4.);
  return (low * 4. + high) / 16.;
}

void main() {
  vec2 pixel = floor(gl_FragCoord.xy / 3.);
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  float t = time * .18;
  float wave = sin(p.x * 3.2 + t + sin(p.y * 2. + t) * .8);
  float glow = exp(-2.8 * length(vec2(p.x * .75, p.y + wave * .22)));
  float bands = .5 + .5 * sin(p.y * 5. - p.x * 2. + t * 1.4);
  float tone = clamp(glow * (.58 + bands * .42), 0., 1.);
  float threshold = bayer4(pixel);
  float ink = step(threshold, tone);
  float grain = .035 * sin(pixel.x * 17. + pixel.y * 29.);
  vec3 color = tint * (.025 + ink * (.28 + tone * .72) + grain);
  color *= 1. - .18 * min(length(p), 2.);
  gl_FragColor = vec4(color, 1.);
}`;

export function DitherField({ paused = false, className = "" }: { paused?: boolean; className?: string }) {
  return <ShaderCanvas fragment={fragment} label="Dither field / ordered pixel study" paused={paused} className={className} />;
}
