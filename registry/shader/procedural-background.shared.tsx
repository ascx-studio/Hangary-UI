"use client";

import { memo, useEffect, useRef, type ComponentProps } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import { createShaderRenderer } from "./shader-renderer.shared";
import { cn } from "cn";
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
  variant,
  settings,
  speed = 0.2,
  interactive = true,
  intensity = 0.9,
  className,
  children,
  ...props
}: ProceduralBackgroundProps & { variant: keyof typeof shaders; settings: readonly [number, number, number?, number?] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const hover = useSpring(0, { stiffness: 180, damping: 24 });
  const cursorX = useSpring(0.5, { stiffness: 100, damping: 22 });
  const cursorY = useSpring(0.5, { stiffness: 100, damping: 22 });
  const brightness = Number.isFinite(intensity) ? Math.max(0, Math.min(2, intensity)) : 0.9;
  const rate = Number.isFinite(speed) ? Math.max(0, speed) : 0.2;

  const [setting0, setting1, setting2 = 0, setting3 = 0] = settings;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    let pointer = [0.5, 0.5];
    const track = (event: PointerEvent) => {
      if (!interactive || reducedMotion || event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer = [(event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height];
      if (variant === "liquid-chrome") {
        cursorX.set(pointer[0]);
        cursorY.set(pointer[1]);
      }
      hover.set(1);
    };
    const leave = () => { hover.set(0); };
    host.addEventListener("pointermove", track);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", leave);
    const cleanup = () => {
      host.removeEventListener("pointermove", track);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      hover.jump(0);
      cursorX.jump(0.5);
      cursorY.jump(0.5);
      renderer.dispose();
    };
    const uniforms = (time: number, size: readonly [number, number]) => ({ cfg: {
      metrics: [size[0], size[1], time * rate, brightness],
      pointer: [variant === "liquid-chrome" ? cursorX.get() : pointer[0], variant === "liquid-chrome" ? cursorY.get() : pointer[1], reducedMotion ? 0 : hover.get(), 0],
      settings: [setting0, setting1, setting2, setting3],
    } });
    const renderer = createShaderRenderer(canvas, shaders[variant], {
      label: `${variant}-background`, uniforms,
      animated: !reducedMotion && (rate > 0 || interactive),
      fps: variant === "liquid-chrome" ? 60 : 30,
      surface: { dpr: variant === "liquid-chrome" ? [1, 1.5] : 1 },
    });
    return cleanup;
  }, [rate, interactive, reducedMotion, hover, brightness, setting0, setting1, setting2, setting3, variant, cursorX, cursorY]);

  return (
    <div {...props} ref={hostRef} data-slot={`${variant}-background`} className={cn("hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-black", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ backgroundImage: fallbacks[variant] }} />
        {variant === "ascii" && <pre className="absolute inset-0 overflow-hidden whitespace-pre-wrap p-4 font-mono text-xs leading-4 text-emerald-400/25">{" .:-=+*#%@   .::--===+++***##%%@@  ".repeat(250)}</pre>}
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full opacity-0" />
      </div>
      {children}
    </div>
  );
});
