"use client";

import { memo, type ComponentProps } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { Canvas } from "./canvas";
import chromaShader from "./chroma-background.wgsl";
import lightTunnelShader from "./light-tunnel-background.wgsl";
import asciiShader from "./ascii-background.wgsl";
import heatmapShader from "./heatmap-background.wgsl";
import liquidChromeShader from "./liquid-chrome-background.wgsl";

const shaders = { chroma: chromaShader, "light-tunnel": lightTunnelShader, ascii: asciiShader, heatmap: heatmapShader, "liquid-chrome": liquidChromeShader };
const fallbacks = {
  "liquid-chrome": "linear-gradient(125deg, #080a0e 5%, #818995 20%, #eef3fa 24%, #161a23 31%, #444d5c 55%, #e6edf7 61%, #11151c 69%, #6a7484 85%, #11151b)",
  chroma: "radial-gradient(ellipse at 20% 30%, #482171, transparent 65%), radial-gradient(ellipse at 80% 70%, #075364, transparent 65%), linear-gradient(135deg, #160d25, #0c1533)",
  "light-tunnel": "repeating-radial-gradient(circle at center, #05091b 0 18px, #403a9c 19px 21px, #05091b 24px 45px)",
  ascii: "linear-gradient(135deg, #03130c, #0a2c20, #03130c)",
  heatmap: "radial-gradient(ellipse at 40% 35%, #f64b17, #f7c522 20%, #0c997c 45%, #183497 70%, #080c31)",
};


export interface ProceduralBackgroundProps extends ComponentProps<"div"> {
  speed?: number;
  interactive?: boolean;
  intensity?: number;
}

export const ProceduralBackground = memo(function ProceduralBackground({
  variant, settings, speed = 0.2, intensity = 0.9, interactive = true,
  onPointerMove, onPointerLeave, onPointerCancel, ...props
}: ProceduralBackgroundProps & { variant: keyof typeof shaders; settings: readonly [number, number, number?, number?] }) {
  const reducedMotion = useReducedMotion();
  const x = useSpring(0.5, { stiffness: 100, damping: 22 });
  const y = useSpring(0.5, { stiffness: 100, damping: 22 });
  const hover = useSpring(0, { stiffness: 180, damping: 24 });
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.2;
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 0.9;
  const leave = () => { hover.set(0); x.set(0.5); y.set(0.5); };
  return <Canvas {...props} shader={shaders[variant]} label={`${variant}-background`}
    fallback={fallbacks[variant]}
    fallbackContent={variant === "ascii" ? <pre className="absolute inset-0 overflow-hidden whitespace-pre-wrap p-4 font-mono text-xs leading-4 text-emerald-400/25">{" .:-=+*#%@   .::--===+++***##%%@@  ".repeat(250)}</pre> : undefined}
    animated={rate > 0 || interactive} fps={variant === "liquid-chrome" ? 60 : 30}
    dpr={variant === "liquid-chrome" ? [1, 1.5] : 1}
    uniforms={(time, size) => ({ cfg: {
      metrics: [size[0], size[1], time * rate, brightness],
      pointer: [x.get(), y.get(), interactive && !reducedMotion ? hover.get() : 0, 0],
      settings: [settings[0], settings[1], settings[2] ?? 0, settings[3] ?? 0],
    } })}
    onPointerMove={event => {
      onPointerMove?.(event);
      if (event.defaultPrevented || !interactive || reducedMotion || event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      x.set(Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)));
      y.set(Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)));
      hover.set(1);
    }}
    onPointerLeave={event => { onPointerLeave?.(event); leave(); }}
    onPointerCancel={event => { onPointerCancel?.(event); leave(); }}
  />;
});
