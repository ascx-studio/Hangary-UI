"use client";
import React, { useRef, useEffect, useCallback, useMemo, memo } from "react";

// ─────────────────────────────────────────────
// SimplexNoise — pure factory, optimized for speed
// ─────────────────────────────────────────────
function createSimplexNoise(seed = 73) {
  const F3 = 1 / 3,
    G3 = 1 / 6;

  // Flattened grad3 for better cache locality and faster access
  const grad3Flat = new Int8Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
    1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
    0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);

  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  const p = new Uint8Array(256);
  let s = seed;
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  // Pre-calculate index access to avoid repeated lookups
  return function noise3D(xin: number, yin: number, zin: number): number {
    const s2 = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s2),
      j = Math.floor(yin + s2),
      k = Math.floor(zin + s2);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t),
      y0 = yin - (j - t),
      z0 = zin - (k - t);
    
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const ii = i & 255, jj = j & 255, kk = k & 255;

    const calc = (dx: number, dy: number, dz: number, ii: number, jj: number, kk: number): number => {
      let t = 0.6 - dx * dx - dy * dy - dz * dz;
      if (t < 0) return 0;
      t *= t;
      const gi = permMod12[(ii + perm[(jj + perm[kk & 255]) & 511]) & 511] * 3;
      return t * t * (grad3Flat[gi] * dx + grad3Flat[gi + 1] * dy + grad3Flat[gi + 2] * dz);
    };

    return 32 * (
      calc(x0, y0, z0, ii, jj, kk) +
      calc(x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3, ii + i1, jj + j1, kk + k1) +
      calc(x0 - i2 + 2 * G3, y0 - j2 + 2 * G3, z0 - k2 + 2 * G3, ii + i2, jj + j2, kk + k2) +
      calc(x0 - 1 + 3 * G3, y0 - 1 + 3 * G3, z0 - 1 + 3 * G3, ii + 1, jj + 1, kk + 1)
    );
  };
}

const EDGE_TABLE = [
  [], [[3, 2]], [[2, 1]], [[3, 1]], [[1, 0]], [[1, 0], [3, 2]], [[2, 0]], [[3, 0]],
  [[0, 3]], [[0, 2]], [[0, 3], [2, 1]], [[0, 1]], [[1, 3]], [[1, 2]], [[2, 3]], [],
];

const PALETTES = {
  studio: { low: { r: 40, g: 60, b: 70 }, mid: { r: 100, g: 180, b: 210 }, high: { r: 160, g: 220, b: 255 } },
  amber: { low: { r: 255, g: 140, b: 80 }, mid: { r: 255, g: 190, b: 120 }, high: { r: 255, g: 230, b: 180 } },
  teal: { low: { r: 100, g: 255, b: 240 }, mid: { r: 150, g: 255, b: 245 }, high: { r: 200, g: 255, b: 255 } },
  violet: { low: { r: 180, g: 140, b: 255 }, mid: { r: 210, g: 180, b: 255 }, high: { r: 240, g: 220, b: 255 } },
};

interface TopographicCanvasProps {
  numContours?: number;
  timeSpeed?: number;
  noiseScale?: number;
  cellSize?: number;
  colorScheme?: "studio" | "amber" | "teal" | "violet";
  mouseInfluence?: boolean;
  showLabels?: boolean;
  hueRotate?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TopographicCanvas = memo(function TopographicCanvas({
  numContours = 24,
  timeSpeed = 0.1,
  noiseScale = 0.002,
  cellSize = 16,
  colorScheme = "amber",
  mouseInfluence = true,
  showLabels = true,
  hueRotate = 0,
  className = "",
  style = {},
}: TopographicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  interface DrawState {
    time: number;
    lastTime: number;
    mouseX: number;
    mouseY: number;
    mouseActive: boolean;
    mouseDown: boolean;
    animId: number | null;
    field: Float32Array;
    fieldCols: number;
    fieldRows: number;
  }

  interface DrawProps {
    numContours: number;
    timeSpeed: number;
    noiseScale: number;
    cellSize: number;
    colorScheme: "studio" | "amber" | "teal" | "violet";
    mouseInfluence: boolean;
    showLabels: boolean;
    hueRotate: number;
  }

  const stateRef = useRef<DrawState>({
    time: 0, lastTime: 0, mouseX: 0, mouseY: 0, mouseActive: false, mouseDown: false,
    animId: null, field: new Float32Array(0), fieldCols: 0, fieldRows: 0,
  });

  const propsRef = useRef<DrawProps>({
    numContours, timeSpeed, noiseScale, cellSize, colorScheme, mouseInfluence, showLabels, hueRotate,
  });
  propsRef.current = { numContours, timeSpeed, noiseScale, cellSize, colorScheme, mouseInfluence, showLabels, hueRotate };

  const noise3D = useMemo(() => createSimplexNoise(Math.random() * 1000), []);

  const fbm = useCallback((x: number, y: number, z: number): number => {
    let val = 0, amp = 1, freq = 1, sum = 0;
    for (let o = 0; o < 3; o++) {
      val += noise3D(x * freq, y * freq, z) * amp;
      sum += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return val / sum;
  }, [noise3D]);

  interface RGBColor { r: number; g: number; b: number; }

  const lerpC = useCallback((a: RGBColor, b: RGBColor, t: number): RGBColor => ({
    r: (a.r + (b.r - a.r) * t) | 0,
    g: (a.g + (b.g - a.g) * t) | 0,
    b: (a.b + (b.b - a.b) * t) | 0,
  }), []);

  const toRgba = useCallback((c: RGBColor, a: number): string => `rgba(${c.r},${c.g},${c.b},${a})`, []);

  const edgePoint = useCallback((edge: number, cx: number, cy: number, cs: number, tl: number, tr: number, br: number, bl: number, thr: number): Array<number> => {
    const lerp = (v1: number, v2: number): number => Math.abs(v2 - v1) < 0.0001 ? 0.5 : (thr - v1) / (v2 - v1);
    switch (edge) {
      case 0: return [cx + lerp(tl, tr) * cs, cy];
      case 1: return [cx + cs, cy + lerp(tr, br) * cs];
      case 2: return [cx + lerp(bl, br) * cs, cy + cs];
      case 3: return [cx, cy + lerp(tl, bl) * cs];
      default: return [cx, cy];
    }
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Opt-out of alpha for background canvas performance
    if (!ctx) return;
    const s = stateRef.current;
    const p = propsRef.current;
    const dpr = window.devicePixelRatio || 1;
    const W = (canvas.width / dpr) | 0;
    const H = (canvas.height / dpr) | 0;

    if (!s.lastTime) s.lastTime = timestamp;
    s.time += ((timestamp - s.lastTime) / 1000) * p.timeSpeed;
    s.lastTime = timestamp;

    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, W, H);

    ctx.filter = p.hueRotate !== 0 ? `hue-rotate(${p.hueRotate}deg) brightness(1.2)` : "brightness(1.2)";

    const cs = p.cellSize;
    const cols = (Math.ceil(W / cs) + 1) | 0;
    const rows = (Math.ceil(H / cs) + 1) | 0;
    if (cols !== s.fieldCols || rows !== s.fieldRows) {
      s.fieldCols = cols;
      s.fieldRows = rows;
      s.field = new Float32Array(cols * rows);
    }

    const field = s.field;
    const noiseScale = p.noiseScale;
    const time = s.time;
    const mouseActive = p.mouseInfluence && s.mouseActive;
    const mouseX = s.mouseX;
    const mouseY = s.mouseY;
    const mouseDown = s.mouseDown;
    const rSq = (Math.min(W, H) * 0.35) ** 2;

    for (let j = 0; j < rows; j++) {
      const rowOffset = (j * cols) | 0;
      const y = j * cs;
      const yScaled = y * noiseScale;
      for (let i = 0; i < cols; i++) {
        const x = i * cs;
        let val = fbm(x * noiseScale, yScaled, time);
        if (mouseActive) {
          const dx = x - mouseX, dy = y - mouseY;
          const dSq = dx * dx + dy * dy;
          if (dSq < rSq) {
            const f = 1 - Math.sqrt(dSq / rSq);
            val += (mouseDown ? -0.4 : 0.4) * f * f;
          }
        }
        field[rowOffset + i] = val;
      }
    }

    let minV = 100, maxV = -100;
    for (let k = 0, len = field.length; k < len; k++) {
      const v = field[k];
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
    const rangeInv = 1 / (maxV - minV || 1);
    for (let k = 0, len = field.length; k < len; k++) {
      field[k] = (field[k] - minV) * rangeInv;
    }

    const palette = PALETTES[p.colorScheme] ?? PALETTES.studio;
    const showLabels = p.showLabels;
    const labelCandidates: any[] = [];
    const NC = p.numContours;

    for (let c = 0; c < NC; c++) {
      const threshold = (c + 1) / (NC + 1);
      const lineColor = threshold < 0.5 ? lerpC(palette.low, palette.mid, threshold * 2) : lerpC(palette.mid, palette.high, (threshold - 0.5) * 2);
      const isMajor = c % 4 === 0;
      const sharpW = isMajor ? 1.4 : 0.7;
      const sharpA = isMajor ? 0.7 : 0.35;

      ctx.beginPath();
      for (let j = 0; j < rows - 1; j++) {
        const r1 = j * cols, r2 = (j + 1) * cols;
        const cy = j * cs;
        for (let i = 0; i < cols - 1; i++) {
          const tl = field[r1 + i], tr = field[r1 + i + 1], br = field[r2 + i + 1], bl = field[r2 + i];
          const idx = (tl >= threshold ? 8 : 0) | (tr >= threshold ? 4 : 0) | (br >= threshold ? 2 : 0) | (bl >= threshold ? 1 : 0);
          const edges = EDGE_TABLE[idx];
          if (edges.length === 0) continue;
          const cx = i * cs;
          for (let e = 0; e < edges.length; e++) {
            const edge = edges[e];
            const pt1 = edgePoint(edge[0], cx, cy, cs, tl, tr, br, bl, threshold);
            const pt2 = edgePoint(edge[1], cx, cy, cs, tl, tr, br, bl, threshold);
            ctx.moveTo(pt1[0], pt1[1]);
            ctx.lineTo(pt2[0], pt2[1]);
            if (showLabels && isMajor && Math.random() < 0.003) {
              labelCandidates.push({ x: (pt1[0] + pt2[0]) * 0.5, y: (pt1[1] + pt2[1]) * 0.5, angle: Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]), elevation: (threshold * 999) | 0, color: lineColor, alpha: sharpA });
            }
          }
        }
      }
      ctx.strokeStyle = toRgba(lineColor, sharpA);
      ctx.lineWidth = sharpW;
      ctx.stroke();
    }

    if (showLabels) {
      const MIN_D2 = 180 * 180;
      const filtered: any[] = [];
      for (let l = 0; l < labelCandidates.length; l++) {
        const lbl = labelCandidates[l];
        if (lbl.x < 100 || lbl.x > W - 100 || lbl.y < 50 || lbl.y > H - 50) continue;
        let tooClose = false;
        for (let f = 0; f < filtered.length; f++) {
          const fl = filtered[f];
          if ((lbl.x - fl.x) ** 2 + (lbl.y - fl.y) ** 2 < MIN_D2) { tooClose = true; break; }
        }
        if (!tooClose) filtered.push(lbl);
      }
      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let l = 0; l < filtered.length; l++) {
        const lbl = filtered[l];
        ctx.save();
        ctx.translate(lbl.x, lbl.y);
        let ang = lbl.angle;
        if (ang > 1.5708) ang -= 3.1416;
        if (ang < -1.5708) ang += 3.1416;
        ctx.rotate(ang);
        ctx.fillStyle = "#030303";
        ctx.fillRect(-12, -6, 24, 12);
        ctx.fillStyle = toRgba(lbl.color, Math.min(1, lbl.alpha * 1.5));
        ctx.fillText(lbl.elevation.toString(), 0, 0);
        ctx.restore();
      }
    }

    ctx.filter = "none";
    const lg = ctx.createLinearGradient(0, 0, W * 0.65, 0);
    lg.addColorStop(0, "#030303");
    lg.addColorStop(1, "rgba(3, 3, 3, 0)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, W, H);

    s.animId = requestAnimationFrame(draw);
  }, [fbm, lerpC, toRgba, edgePoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);
    stateRef.current.animId = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId);
    };
  }, [draw, handleResize]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    const s = stateRef.current;
    s.mouseX = e.clientX - r.left;
    s.mouseY = e.clientY - r.top;
    s.mouseActive = true;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={() => (stateRef.current.mouseActive = false)}
      onMouseDown={() => (stateRef.current.mouseDown = true)}
      onMouseUp={() => (stateRef.current.mouseDown = false)}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
});
