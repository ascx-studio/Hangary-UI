"use client";

import { ShaderCanvas } from "../lib/shader-canvas";

const fragment = `precision mediump float;
uniform vec2 resolution;
uniform float time;
void main(){
  vec2 p=(gl_FragCoord.xy*2.-resolution)/min(resolution.x,resolution.y);
  float t=time*.16;
  float terrain=sin(p.x*2.+sin(p.y*2.2+t))+cos(p.y*2.4-p.x*.7-t);
  terrain+=.45*sin(p.x*4.1+p.y*2.3+t);
  float contour=pow(.5+.5*cos(terrain*19.),22.);
  float broad=.5+.5*sin(terrain*2.-t);
  vec3 base=mix(vec3(.035,.045,.047),vec3(.21,.105,.04),broad);
  vec3 color=base+contour*mix(vec3(.29,.19,.075),vec3(.96,.62,.25),broad)*.75;
  color*=1.-.2*min(length(p),2.);
  gl_FragColor=vec4(color,1.);
}`;

export function ContourDrift({ paused = false, className = "" }: { paused?: boolean; className?: string }) {
  return <ShaderCanvas fragment={fragment} label="Contour drift / living atlas" paused={paused} className={className} />;
}
