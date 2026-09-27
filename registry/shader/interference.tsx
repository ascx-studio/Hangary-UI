"use client";

import { ShaderCanvas } from "../lib/shader-canvas";

const fragment = `precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec3 tint;
uniform float frequency;
void main(){
  vec2 p=(gl_FragCoord.xy*2.-resolution)/min(resolution.x,resolution.y);
  float r=length(p*vec2(.8,1.));
  float wave=sin(r*(18.+frequency*.2)-time*1.3+sin(p.x*3.+time*.3)*2.);
  float rings=pow(.5+.5*wave,9.);
  float halo=exp(-r*1.3);
  vec3 color=mix(tint*.035,tint,rings*halo*.7);
  color+=tint*halo*.22;
  gl_FragColor=vec4(color,1.);
}`;

export type InterferenceProps = { frequency?: number; paused?: boolean; className?: string };

/** Interference shader rendered through the shared WebGL canvas. */
export function Interference({ frequency = 42, paused = false, className = "" }: InterferenceProps) {
  return <ShaderCanvas
    fragment={fragment}
    label="Interference field / signal study"
    frequency={frequency}
    paused={paused}
    className={className}
    background="radial-gradient(ellipse at center, color-mix(in oklab, var(--primary) 45%, var(--secondary)), var(--secondary) 70%)"
  />;
}
