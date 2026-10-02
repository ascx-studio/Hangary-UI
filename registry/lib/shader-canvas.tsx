"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ShaderTint = readonly [number, number, number] | string;
export type ShaderCanvasProps = { fragment: string; className?: string; paused?: boolean; tint?: ShaderTint; frequency?: number; };

function resolveCssColor(color: string, element: HTMLElement): readonly [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  element.parentElement?.append(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return [0.5, 0.5, 0.5];
  context.fillStyle = computed;
  context.fillRect(0, 0, 1, 1);
  const pixel = context.getImageData(0, 0, 1, 1).data;
  return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255];
}

/** Shared WebGL surface. Stops animation while hidden or when reduced motion is requested. */
export function ShaderCanvas({ fragment, className = "", paused = false, tint = "var(--primary)", frequency = 42 }: ShaderCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);
  const tintRef = useRef<readonly [number, number, number]>([0.5, 0.5, 0.5]);
  const frequencyRef = useRef(frequency);
  const vertexPositions = useMemo(() => new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), []);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const updateTint = () => {
      tintRef.current = typeof tint === "string" ? resolveCssColor(tint, canvas) : tint;
    };
    updateTint();
    const themeObserver = new MutationObserver(updateTint);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    return () => themeObserver.disconnect();
  }, [tint]);
  useEffect(() => { frequencyRef.current = frequency; }, [frequency]);
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) return;
    const program = gl.createProgram();
    if (!program) return;
    const shaders: WebGLShader[] = [];
    const cleanup = () => { shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); };
    for (const [type, source] of [[gl.VERTEX_SHADER, 'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}'], [gl.FRAGMENT_SHADER, fragment]] as const) {
      const shader = gl.createShader(type);
      if (!shader) { cleanup(); return; }
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { cleanup(); return; }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { cleanup(); return; }
    const buffer = gl.createBuffer();
    if (!buffer) { cleanup(); return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution");
    const time = gl.getUniformLocation(program, "time");
    const tintLocation = gl.getUniformLocation(program, "tint");
    const frequencyLocation = gl.getUniformLocation(program, "frequency");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = elapsedRef.current;
    let previous = 0;
    let visible = true;
    let lost = false;
    function draw(now: number) {
      if (!gl || !canvas || lost) return;
      frame = 0;
      const animate = !paused && !motion.matches && visible && !document.hidden;
      if (animate && previous) elapsed += Math.min(now - previous, 50) / 1000;
      elapsedRef.current = elapsed;
      previous = animate ? now : 0;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(time, elapsed);
      gl.uniform3f(tintLocation, tintRef.current[0], tintRef.current[1], tintRef.current[2]);
      gl.uniform1f(frequencyLocation, frequencyRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (animate) frame = requestAnimationFrame(draw);
    }
    function refresh() { cancelAnimationFrame(frame); previous = 0; frame = requestAnimationFrame(draw); }
    const resize = new ResizeObserver(refresh);
    resize.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); });
    intersection.observe(canvas);
    const onLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); };
    const onRestored = () => setGeneration(value => value + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    document.addEventListener("visibilitychange", refresh);
    motion.addEventListener("change", refresh);
    refresh();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost); canvas.removeEventListener("webglcontextrestored", onRestored);
      document.removeEventListener("visibilitychange", refresh); motion.removeEventListener("change", refresh);
      gl.deleteBuffer(buffer); cleanup();
    };
  }, [fragment, paused, generation, vertexPositions]);
  return <div className={`h-full min-h-64 w-full overflow-hidden ${className}`}>
    <canvas ref={ref} aria-hidden="true" className="inset-0 h-full w-full" />
  </div>;
}
