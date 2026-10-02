"use client";

import { ShaderCanvas } from "../lib/shader-canvas";

const fragment = `precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec3 tint;
void main(){
  vec2 p=(gl_FragCoord.xy*2.-resolution)/min(resolution.x,resolution.y);
  float t=time*.3;
  vec3 color=tint*.025;
  for(int i=0;i<6;i++){
    float f=float(i);
    float center=sin(p.x*1.5+t+f*.38)*.47+sin(p.x*.7-t*.6)*.3+(f-2.5)*.13;
    float d=abs(p.y-center);
    float ribbon=.017/(d+.035);
    vec3 hue=tint*(.5+.5*cos(vec3(0.,2.,4.)+f*.6+p.x*.8+t*.3));
    color+=hue*ribbon*.38;
    color+=tint*pow(max(0.,1.-d*32.),3.)*.22;
  }
  color*=1.-.15*min(length(p),2.);
  gl_FragColor=vec4(color,1.);
}`;

export function PrismRibbon({ paused = false, className = "" }: { paused?: boolean; className?: string }) {
  return <ShaderCanvas fragment={fragment} paused={paused} className={className} />;
}
