"use client";

import { ShaderCanvas } from "../lib/shader-canvas";

const fragment = `precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec3 tint;
void main(){
  vec2 p=(gl_FragCoord.xy*2.-resolution)/min(resolution.x,resolution.y);
  float t=time*.22;
  float curtain=sin(p.x*2.4+t+sin(p.x*1.2-t)*1.4);
  float fold=exp(-pow((p.y-(.16+curtain*.28))*2.2,2.));
  float veil=fold*(.42+.58*sin(p.x*3.3-t*.7));
  float stars=step(.997,sin(p.x*89.+p.y*137.)*sin(p.y*61.-p.x*43.));
  vec3 color=vec3(.012,.018,.038)+tint*max(0.,veil)*.72+vec3(.55,.8,1.)*stars*.8;
  color*=1.-.17*min(length(p),2.);
  gl_FragColor=vec4(color,1.);
}`;

export function AuroraVeil({ paused = false, tint = [0.62, 0.76, 1] as const, className = "" }: { paused?: boolean; tint?: readonly [number, number, number]; className?: string }) {
  return <ShaderCanvas fragment={fragment} label="Aurora veil / daylight study" paused={paused} tint={tint} className={className} />;
}
