"use client";

import * as motion from "motion/react-client";
import { animate, useReducedMotion } from "motion/react";

import React, { memo, useEffect, useMemo, useRef, useCallback, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import binaryFlowerShader from "@/hangry/shader/binary-flower-garden.wgsl";
import { Canvas } from "@/hangry/shader/canvas";
import { sampler, texture, type Texture } from "vgpu";

/**
 * BinaryFlowerGarden
 * Interactive floral simulation rendered directly through WebGPU WGSL fragment shader
 * with real-time binary matrix glyph sampling and petal collision/shedding dynamics.
 */

interface FlowerData {
  type: "cornflower" | "dahlia" | "rose" | "poppy" | "marigold";
  name: string;
  x: number;
  height: number;
  size: number;
  lean: number;
  color: string;
  innerColor: string;
  highlight: string;
}

const FLOWERS_DATA: FlowerData[] = [
  {
    type: "poppy",
    name: "Coral Poppy",
    x: 48,
    height: 110,
    size: 0.5,
    lean: -9,
    color: "#fb7185",
    innerColor: "#be123c",
    highlight: "#ffe4e6",
  },
  {
    type: "marigold",
    name: "Little Gold",
    x: 142,
    height: 86,
    size: 0.46,
    lean: 5,
    color: "#fbbf24",
    innerColor: "#b45309",
    highlight: "#fef3c7",
  },
  {
    type: "cornflower",
    name: "Lavender Cornflower",
    x: 230,
    height: 122,
    size: 0.54,
    lean: -6,
    color: "#c084fc",
    innerColor: "#7e22ce",
    highlight: "#f3e8ff",
  },
  {
    type: "dahlia",
    name: "Peach Dahlia",
    x: 320,
    height: 82,
    size: 0.48,
    lean: 4,
    color: "#fdba74",
    innerColor: "#ea580c",
    highlight: "#fff7ed",
  },
  {
    type: "poppy",
    name: "Blush Poppy",
    x: 395,
    height: 116,
    size: 0.5,
    lean: -5,
    color: "#f9a8d4",
    innerColor: "#db2777",
    highlight: "#fce7f3",
  },
  {
    type: "cornflower",
    name: "Sky Cornflower",
    x: 545,
    height: 96,
    size: 0.52,
    lean: 7,
    color: "#7dd3fc",
    innerColor: "#0284c7",
    highlight: "#f0f9ff",
  },
  {
    type: "rose",
    name: "Pink Garden Rose",
    x: 625,
    height: 115,
    size: 0.48,
    lean: -5,
    color: "#f472b6",
    innerColor: "#9d174d",
    highlight: "#fce7f3",
  },
  {
    type: "marigold",
    name: "Apricot Marigold",
    x: 785,
    height: 92,
    size: 0.48,
    lean: 3,
    color: "#fb923c",
    innerColor: "#c2410c",
    highlight: "#ffedd5",
  },
  {
    type: "cornflower",
    name: "Blue Cornflower",
    x: 100,
    height: 155,
    size: 0.78,
    lean: -7,
    color: "#38bdf8",
    innerColor: "#1d4ed8",
    highlight: "#e0f2fe",
  },
  {
    type: "dahlia",
    name: "Yellow Dahlia",
    x: 185,
    height: 180,
    size: 0.82,
    lean: -4,
    color: "#facc15",
    innerColor: "#ca8a04",
    highlight: "#fef08a",
  },
  {
    type: "rose",
    name: "Ruby Rose",
    x: 275,
    height: 198,
    size: 0.88,
    lean: -3,
    color: "#f43f5e",
    innerColor: "#9f1239",
    highlight: "#ffe4e6",
  },
  {
    type: "poppy",
    name: "Scarlet Poppy",
    x: 355,
    height: 165,
    size: 0.84,
    lean: -5,
    color: "#ef4444",
    innerColor: "#7f1d1d",
    highlight: "#fecaca",
  },
  {
    type: "rose",
    name: "Imperial Rose",
    x: 430,
    height: 232,
    size: 1.05,
    lean: 0,
    color: "#e11d48",
    innerColor: "#4c0519",
    highlight: "#fecdd3",
  },
  {
    type: "marigold",
    name: "Golden Marigold",
    x: 510,
    height: 160,
    size: 0.82,
    lean: 4,
    color: "#f97316",
    innerColor: "#9a3412",
    highlight: "#ffedd5",
  },
  {
    type: "dahlia",
    name: "Amber Dahlia",
    x: 585,
    height: 202,
    size: 0.87,
    lean: 5,
    color: "#f59e0b",
    innerColor: "#b45309",
    highlight: "#fef3c7",
  },
  {
    type: "cornflower",
    name: "Indigo Star",
    x: 665,
    height: 158,
    size: 0.8,
    lean: 6,
    color: "#818cf8",
    innerColor: "#3730a3",
    highlight: "#e0e7ff",
  },
  {
    type: "poppy",
    name: "Sunset Poppy",
    x: 740,
    height: 175,
    size: 0.82,
    lean: 7,
    color: "#fb923c",
    innerColor: "#c2410c",
    highlight: "#ffedd5",
  },
];

interface PetalConfig {
  layer: number;
  shape: string;
  angle: number;
  radius: number;
  width: number;
  height: number;
}

const SPECIES_PETALS: Record<string, PetalConfig[]> = {
  dahlia: [
    { count: 8, radius: 43, width: 27, height: 35, phase: 0 },
    { count: 6, radius: 27, width: 23, height: 28, phase: 0.45 },
    { count: 4, radius: 12, width: 15, height: 21, phase: 0.2 },
  ].flatMap((layer, layerIdx) =>
    Array.from({ length: layer.count }, (_, i) => ({
      layer: layerIdx,
      shape: "ellipse",
      angle: (i * Math.PI * 2) / layer.count - Math.PI / 2 + layer.phase,
      radius: layer.radius,
      width: layer.width,
      height: layer.height,
    })),
  ),

  rose: [
    ...Array.from({ length: 6 }, (_, i) => ({
      layer: 0,
      shape: "rose_petal",
      angle: (i * Math.PI * 2) / 6,
      radius: 40,
      width: 38,
      height: 42,
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      layer: 1,
      shape: "rose_petal",
      angle: (i * Math.PI * 2) / 5 + 0.52,
      radius: 25,
      width: 29,
      height: 33,
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
      layer: 2,
      shape: "rose_petal",
      angle: (i * Math.PI * 2) / 4 + 1.1,
      radius: 11,
      width: 19,
      height: 22,
    })),
  ],

  cornflower: [
    ...Array.from({ length: 12 }, (_, i) => ({
      layer: 0,
      shape: "serrated_ray",
      angle: (i * Math.PI * 2) / 12,
      radius: 36,
      width: 14,
      height: 46,
    })),
    ...Array.from({ length: 8 }, (_, i) => ({
      layer: 1,
      shape: "serrated_ray",
      angle: (i * Math.PI * 2) / 8 + 0.38,
      radius: 18,
      width: 12,
      height: 28,
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      layer: 2,
      shape: "floret",
      angle: (i * Math.PI * 2) / 5 + 0.6,
      radius: 8,
      width: 10,
      height: 14,
    })),
  ],

  poppy: [
    ...Array.from({ length: 4 }, (_, i) => ({
      layer: 0,
      shape: "broad_cup",
      angle: (i * Math.PI * 2) / 4 + 0.35,
      radius: 32,
      width: 44,
      height: 46,
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
      layer: 1,
      shape: "broad_cup",
      angle: (i * Math.PI * 2) / 4 - 0.42,
      radius: 20,
      width: 32,
      height: 34,
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      layer: 2,
      shape: "floret",
      angle: (i * Math.PI * 2) / 6,
      radius: 7,
      width: 9,
      height: 11,
    })),
  ],

  marigold: [
    ...Array.from({ length: 10 }, (_, i) => ({
      layer: 0,
      shape: "ruffled",
      angle: (i * Math.PI * 2) / 10,
      radius: 38,
      width: 22,
      height: 34,
    })),
    ...Array.from({ length: 8 }, (_, i) => ({
      layer: 1,
      shape: "ruffled",
      angle: (i * Math.PI * 2) / 8 + 0.4,
      radius: 24,
      width: 19,
      height: 27,
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      layer: 2,
      shape: "ruffled",
      angle: (i * Math.PI * 2) / 6 + 0.2,
      radius: 11,
      width: 14,
      height: 18,
    })),
  ],
};

const LEAF_PAIRS = [
  { t: 0.38, side: -1, length: 35, tilt: -0.44 },
  { t: 0.62, side: 1, length: 31, tilt: 0.4 },
];

interface PetalRegrowth {
  landedAt: number;
}

interface FallingPetal {
  regrowth: PetalRegrowth;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  radius: number;
  width: number;
  height: number;
  shape: string;
  color: string;
  innerColor: string;
  highlight: string;
  settled: boolean;
  settledY: number;
}

interface StemState {
  angle: number;
  velocity: number;
  energy: number;
  missingPetals: Map<number, PetalRegrowth>;
  regrowProgress: number;
  isRegrowing: boolean;
  lastShedTime: number;
}

export interface BinaryFlowerGardenProps extends ComponentProps<"div"> {
  dark?: boolean;
  windSpeed?: number;
}

export const BinaryFlowerGarden = memo(function BinaryFlowerGarden({
  className,
  dark = true,
  windSpeed = 1,
  ...props
}: BinaryFlowerGardenProps) {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const growthCompleteRef = useRef(false);
  const windSpeedRef = useRef(1);
  useEffect(() => {
    windSpeedRef.current = Number.isFinite(windSpeed) ? Math.max(0, Math.min(3, windSpeed)) : 1;
  }, [windSpeed]);
  const stemsRef = useRef<StemState[]>(
    FLOWERS_DATA.map((fl) => ({
      angle: (fl.lean * Math.PI) / 180,
      velocity: 0,
      energy: 0,
      missingPetals: new Map(),
      regrowProgress: 1.0,
      isRegrowing: false,
      lastShedTime: 0,
    })),
  );

  const petalsRef = useRef<FallingPetal[]>([]);

  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    down: false,
  });

  // Pre-generate the underlying pseudo-random binary glyph field texture
  const buildGlyphField = useCallback((width: number, height: number, cellSize: number) => {
    const glyphCanvas = document.createElement("canvas");
    glyphCanvas.width = width;
    glyphCanvas.height = height;
    const gctx = glyphCanvas.getContext("2d");
    if (!gctx) return null;

    gctx.font = `900 ${cellSize * 0.92}px monospace`;
    gctx.textAlign = "center";
    gctx.textBaseline = "middle";
    gctx.fillStyle = "#ffffff";

    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = (Math.imul(r * cols + c + 1, 2654435761) >>> 16) & 1;
        gctx.fillText(String(val), (c + 0.5) * cellSize, (r + 0.5) * cellSize);
      }
    }
    return glyphCanvas;
  }, []);

  const shedPetalsFromFlower = useCallback((idx: number, count = 2) => {
    const flower = FLOWERS_DATA[idx];
    const stem = stemsRef.current[idx];
    const speciesPetals = SPECIES_PETALS[flower.type] || SPECIES_PETALS.dahlia;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const groundY = height * 0.78;
    const scale = Math.min(width / 840, height / 360);
    const offsetX = (width - 800 * scale) / 2;

    const rootX = offsetX + flower.x * scale;
    const stemLength = flower.height * scale;
    const headX = rootX + Math.sin(stem.angle) * stemLength;
    const headY = groundY - Math.cos(stem.angle) * stemLength;

    for (let c = 0; c < count; c++) {
      if (stem.missingPetals.size >= speciesPetals.length) break;

      let targetPetalIdx = -1;
      for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
        const available = speciesPetals
          .map((p, idxP) => ({ ...p, originalIdx: idxP }))
          .filter((p) => p.layer === layerIdx && !stem.missingPetals.has(p.originalIdx));

        if (available.length > 0) {
          targetPetalIdx = available[Math.floor(Math.random() * available.length)].originalIdx;
          break;
        }
      }

      if (targetPetalIdx !== -1) {
        const regrowth = { landedAt: Infinity };
        stem.missingPetals.set(targetPetalIdx, regrowth);
        const pData = speciesPetals[targetPetalIdx];
        const pAngle = pData.angle + stem.angle * 0.7;
        const pDist = pData.radius * flower.size * scale;
        const spawnX = headX + Math.cos(pAngle) * pDist;
        const spawnY = headY + Math.sin(pAngle) * pDist;

        petalsRef.current.push({
          regrowth,
          x: spawnX,
          y: spawnY,
          vx: stem.velocity * 10 + (Math.random() - 0.5) * 55,
          vy: -25 - Math.random() * 35,
          angle: pAngle,
          vAngle: (Math.random() - 0.5) * 6,
          radius: pData.width * 0.65 * flower.size * scale,
          width: pData.width * flower.size * scale,
          height: pData.height * flower.size * scale,
          shape: pData.shape,
          color: flower.color,
          innerColor: flower.innerColor,
          highlight: flower.highlight,
          settled: false,
          settledY: groundY + 3 + Math.random() * 14,
        });
      }
    }
  }, []);

  // Canvas owns rendering; this closure supplies simulation state and bindings.
  const garden = useMemo(() => {
    let growthTime = reduceMotion ? 3.6 : 0;
    let growthAnimation: ReturnType<typeof animate> | undefined;
    const growthFor = (flower: FlowerData) => {
      const progress = Math.max(0, Math.min(1, (growthTime - (flower.x / 800) * 0.9) / 2.4));
      return progress * progress * (3 - 2 * progress);
    };
    let lastTime = 0;
    let simTime = 0;
    let windTime = 0;
    let nextRandomShedAt: number | undefined;
    let shapeTexture: Texture | undefined;
    let glyphTexture: Texture | undefined;
    let textureSampler: GPUSampler | undefined;
    let textureSize = "";
    let owner: import("vgpu").Gpu | undefined;
    let shapeCanvas: HTMLCanvasElement | undefined;

    const render = (time: number, size: readonly [number, number], gpu?: import("vgpu").Gpu) => {
      if (!gpu) throw new Error("Binary flower garden requires a GPU context");
      if (owner !== gpu) {
        shapeTexture?.destroy();
        glyphTexture?.destroy();
        shapeTexture = undefined;
        glyphTexture = undefined;
        textureSampler = undefined;
        textureSize = "";
        lastTime = 0;
        nextRandomShedAt = undefined;
        growthAnimation?.stop();
        growthAnimation = undefined;
        growthTime = reduceMotion ? 3.6 : 0;
        owner = gpu;
      }
      shapeCanvas ??= document.createElement("canvas");
      const shapeCtx = shapeCanvas.getContext("2d");
      if (!shapeCtx) throw new Error("Binary flower garden could not create its shape atlas");
      if (!reduceMotion && !growthAnimation && time > 0) {
        growthAnimation = animate(0, 3.6, {
          duration: 3.6,
          ease: "linear",
          onUpdate: (value) => {
            growthTime = value;
          },
        });
      }
      growthCompleteRef.current = growthTime >= 3.6;
      const now = time * 1000;
      const wallTime = performance.now();
      const dt = reduceMotion ? 0 : Math.min(Math.max((now - lastTime) / 1000, 0), 0.05);
      lastTime = now;
      simTime += dt;
      const windRate = windSpeedRef.current;
      windTime += dt * windRate;

      const [width, height] = size;
      const groundY = height * 0.78;

      if (shapeCanvas.width !== width || shapeCanvas.height !== height) {
        shapeCanvas.width = width;
        shapeCanvas.height = height;
      }

      const scale = Math.min(width / 840, height / 360);
      const offsetX = (width - 800 * scale) / 2;

      const mouseSpeed = Math.hypot(
        mouseRef.current.x - mouseRef.current.prevX,
        mouseRef.current.y - mouseRef.current.prevY,
      );

      // 1. Wind sway oscillation
      const windWave = reduceMotion
        ? 0
        : (Math.sin(windTime * 0.95 + Math.sin(windTime * 0.38) * 1.4) * 0.55 +
            Math.sin(windTime * 2.3) * 0.18) *
          Math.min(windRate, 1.5);

      // 2. Clear Shape Buffer
      shapeCtx.clearRect(0, 0, width, height);

      // 3. Update Stems & Plucking Mechanics
      stemsRef.current.forEach((stem, idx) => {
        const flower = FLOWERS_DATA[idx];
        const rootX = offsetX + flower.x * scale;
        const stemLength = flower.height * scale * growthFor(flower);
        const targetAngle = (flower.lean * Math.PI) / 180 + windWave * 0.22;

        const headX = rootX + Math.sin(stem.angle) * stemLength;
        const headY = groundY - Math.cos(stem.angle) * stemLength;
        const headRadius = 40 * flower.size * scale;
        const mouseDist = Math.hypot(mouseRef.current.x - headX, mouseRef.current.y - headY);

        if (growthCompleteRef.current && mouseDist < headRadius + 24) {
          const pushDelta = Math.max(
            -0.04,
            Math.min(0.04, (mouseRef.current.x - mouseRef.current.prevX) * 0.0018),
          );
          stem.velocity += pushDelta * 6;
        }

        const stiffness = 22.0;
        const damping = 4.2;
        const force = -stiffness * (stem.angle - targetAngle);
        const accel = force - damping * stem.velocity;
        stem.velocity = Math.max(-6.0, Math.min(6.0, stem.velocity + accel * dt));
        stem.angle = Math.max(-0.85, Math.min(0.85, stem.angle + stem.velocity * dt));

        // Wait three seconds after landing, then unfold the missing petal back.
        for (const [petalIndex, regrowth] of stem.missingPetals) {
          if (wallTime - regrowth.landedAt >= 3400) stem.missingPetals.delete(petalIndex);
        }

        if (stem.isRegrowing) {
          stem.regrowProgress += dt * 0.85;
          if (stem.regrowProgress >= 1.0) {
            stem.regrowProgress = 1.0;
            stem.isRegrowing = false;
            stem.missingPetals.clear();
          }
        }
      });

      // 3b. Flower collisions
      for (let i = 0; growthCompleteRef.current && i < FLOWERS_DATA.length; i++) {
        for (let j = i + 1; j < FLOWERS_DATA.length; j++) {
          const flA = FLOWERS_DATA[i];
          const flB = FLOWERS_DATA[j];
          const stemA = stemsRef.current[i];
          const stemB = stemsRef.current[j];

          const rootAX = offsetX + flA.x * scale;
          const rootBX = offsetX + flB.x * scale;
          const lenA = flA.height * scale;
          const lenB = flB.height * scale;

          const headAX = rootAX + Math.sin(stemA.angle) * lenA;
          const headAY = groundY - Math.cos(stemA.angle) * lenA;
          const headBX = rootBX + Math.sin(stemB.angle) * lenB;
          const headBY = groundY - Math.cos(stemB.angle) * lenB;

          const radA = 28 * flA.size * scale;
          const radB = 28 * flB.size * scale;
          const dHeads = Math.hypot(headAX - headBX, headAY - headBY);

          if (dHeads < radA + radB && dHeads > 0.001) {
            const overlap = radA + radB - dHeads;
            const impulse = Math.min(
              1.8,
              overlap * 0.025 + Math.abs(stemA.velocity - stemB.velocity) * 0.2,
            );

            if (headAX < headBX) {
              stemA.velocity = Math.max(-5.5, stemA.velocity - impulse);
              stemB.velocity = Math.min(5.5, stemB.velocity + impulse);
            } else {
              stemA.velocity = Math.min(5.5, stemA.velocity + impulse);
              stemB.velocity = Math.max(-5.5, stemB.velocity - impulse);
            }

            [i, j].forEach((flIdx) => {
              const targetFlower = FLOWERS_DATA[flIdx];
              const targetStem = stemsRef.current[flIdx];
              const targetSpeciesPetals =
                SPECIES_PETALS[targetFlower.type] || SPECIES_PETALS.dahlia;

              if (
                now - targetStem.lastShedTime > 110 &&
                targetStem.missingPetals.size < targetSpeciesPetals.length
              ) {
                targetStem.lastShedTime = now;

                let targetPetalIdx = -1;
                for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
                  const available = targetSpeciesPetals
                    .map((p, idxP) => ({ ...p, originalIdx: idxP }))
                    .filter(
                      (p) => p.layer === layerIdx && !targetStem.missingPetals.has(p.originalIdx),
                    );

                  if (available.length > 0) {
                    targetPetalIdx =
                      available[Math.floor(Math.random() * available.length)].originalIdx;
                    break;
                  }
                }

                if (targetPetalIdx !== -1) {
                  const regrowth = { landedAt: Infinity };
                  targetStem.missingPetals.set(targetPetalIdx, regrowth);
                  const pData = targetSpeciesPetals[targetPetalIdx];

                  const curHeadX = flIdx === i ? headAX : headBX;
                  const curHeadY = flIdx === i ? headAY : headBY;
                  const pAngle = pData.angle + targetStem.angle * 0.7;
                  const pDist = pData.radius * targetFlower.size * scale;
                  const spawnX = curHeadX + Math.cos(pAngle) * pDist;
                  const spawnY = curHeadY + Math.sin(pAngle) * pDist;

                  petalsRef.current.push({
                    regrowth,
                    x: spawnX,
                    y: spawnY,
                    vx: targetStem.velocity * 10 + (Math.random() - 0.5) * 45,
                    vy: -20 - Math.random() * 30,
                    angle: pAngle,
                    vAngle: (Math.random() - 0.5) * 5,
                    radius: pData.width * 0.65 * targetFlower.size * scale,
                    width: pData.width * targetFlower.size * scale,
                    height: pData.height * targetFlower.size * scale,
                    shape: pData.shape,
                    color: targetFlower.color,
                    innerColor: targetFlower.innerColor,
                    highlight: targetFlower.highlight,
                    settled: false,
                    settledY: groundY + 3 + Math.random() * 14,
                  });
                }
              }
            });
          }
        }
      }

      // The breeze occasionally plucks one petal after the garden has grown.
      if (!reduceMotion && growthCompleteRef.current && windRate > 0) {
        nextRandomShedAt ??= simTime + 1.5 + Math.random() * 2.5;
        if (simTime >= nextRandomShedAt) {
          const available = FLOWERS_DATA.map((flower, index) => ({ flower, index })).filter(
            ({ flower, index }) => {
              const stem = stemsRef.current[index];
              return (
                !stem.isRegrowing && stem.missingPetals.size < SPECIES_PETALS[flower.type].length
              );
            },
          );
          if (available.length > 0) {
            const chosen = available[Math.floor(Math.random() * available.length)];
            shedPetalsFromFlower(chosen.index, 1);
          }
          nextRandomShedAt = simTime + 1.5 + Math.random() * 2.5;
        }
      }

      // 4. Update Falling & Settled Petals
      const remainingPetals: FallingPetal[] = [];
      petalsRef.current.forEach((petal) => {
        if (!petal.settled) {
          petal.vy += 115 * dt;
          petal.vx += (windWave * 30 - petal.vx) * 0.75 * dt;
          petal.x += petal.vx * dt;
          petal.y += petal.vy * dt;
          petal.angle += petal.vAngle * dt;

          if (petal.y >= petal.settledY) {
            petal.y = petal.settledY;
            petal.settled = true;
            if (!Number.isFinite(petal.regrowth.landedAt)) petal.regrowth.landedAt = wallTime;
            petal.vx = 0;
            petal.vy = 0;
            petal.vAngle = 0;
          }

          const pDist = Math.hypot(mouseRef.current.x - petal.x, mouseRef.current.y - petal.y);
          if (pDist < 45 && mouseSpeed > 1.8) {
            petal.settled = false;
            const pushX = (mouseRef.current.x - mouseRef.current.prevX) * 0.9;
            petal.vx += pushX + (Math.random() - 0.5) * 35;
            petal.vy -= 40 + Math.random() * 55;
            petal.vAngle = (Math.random() - 0.5) * 10;
          }
        }

        if (petal.x > -60 && petal.x < width + 60) remainingPetals.push(petal);
      });
      petalsRef.current = remainingPetals.slice(-512);

      // 5. DRAW STEMS & LEAVES
      FLOWERS_DATA.forEach((flower, idx) => {
        if (growthFor(flower) <= 0) return;
        const stem = stemsRef.current[idx];
        const rootX = offsetX + flower.x * scale;
        const stemLength = flower.height * scale * growthFor(flower);
        const headX = rootX + Math.sin(stem.angle) * stemLength;
        const headY = groundY - Math.cos(stem.angle) * stemLength;

        const stemGrad = shapeCtx.createLinearGradient(rootX, groundY, headX, headY);
        stemGrad.addColorStop(0, "#064e3b");
        stemGrad.addColorStop(0.5, "#059669");
        stemGrad.addColorStop(1, "#10b981");

        shapeCtx.strokeStyle = stemGrad;
        shapeCtx.lineWidth = 7.5 * scale;
        shapeCtx.lineCap = "round";
        shapeCtx.beginPath();
        shapeCtx.moveTo(rootX, groundY);
        shapeCtx.quadraticCurveTo(rootX, (groundY + headY) / 2, headX, headY);
        shapeCtx.stroke();

        LEAF_PAIRS.forEach((leaf) => {
          const t = leaf.t;
          const lx = rootX + (headX - rootX) * t;
          const ly = groundY + (headY - groundY) * t;
          const leafLen = leaf.length * flower.size * scale;
          const leafAngle = stem.angle + leaf.tilt;

          shapeCtx.save();
          shapeCtx.translate(lx, ly);
          shapeCtx.rotate(leafAngle);
          const leafGrowth = Math.max(0, Math.min(1, (growthFor(flower) - leaf.t * 0.5) * 2));
          shapeCtx.scale(leafGrowth, leafGrowth);

          const leafGrad = shapeCtx.createLinearGradient(0, 0, leaf.side * leafLen, -15 * scale);
          leafGrad.addColorStop(0, "#047857");
          leafGrad.addColorStop(1, "#34d399");

          shapeCtx.fillStyle = leafGrad;
          shapeCtx.beginPath();
          shapeCtx.moveTo(0, 0);
          shapeCtx.quadraticCurveTo(
            leaf.side * leafLen * 0.45,
            -22 * scale,
            leaf.side * leafLen,
            -10 * scale,
          );
          shapeCtx.quadraticCurveTo(leaf.side * leafLen * 0.55, 12 * scale, 0, 0);
          shapeCtx.fill();
          shapeCtx.restore();
        });
      });

      // 6. DRAW FLOWER HEADS
      FLOWERS_DATA.forEach((flower, idx) => {
        const stem = stemsRef.current[idx];
        const speciesPetals = SPECIES_PETALS[flower.type] || SPECIES_PETALS.dahlia;
        const rootX = offsetX + flower.x * scale;
        const stemLength = flower.height * scale * growthFor(flower);
        const headX = rootX + Math.sin(stem.angle) * stemLength;
        const headY = groundY - Math.cos(stem.angle) * stemLength;
        const bloom = Math.max(0, Math.min(1, (growthFor(flower) - 0.65) / 0.35));
        if (bloom <= 0) return;
        const baseScale = flower.size * scale * bloom;

        shapeCtx.save();
        shapeCtx.translate(headX, headY);
        shapeCtx.rotate(stem.angle * 0.7);

        const drawSpeciesPetal = (shape: string, rx: number, ry: number) => {
          shapeCtx.beginPath();
          if (shape === "rose_petal") {
            shapeCtx.moveTo(0, ry * 0.5);
            shapeCtx.bezierCurveTo(-rx * 0.9, ry * 0.3, -rx * 1.1, -ry * 0.5, -rx * 0.4, -ry);
            shapeCtx.bezierCurveTo(0, -ry * 1.15, 0, -ry * 1.15, rx * 0.4, -ry);
            shapeCtx.bezierCurveTo(rx * 1.1, -ry * 0.5, rx * 0.9, ry * 0.3, 0, ry * 0.5);
          } else if (shape === "serrated_ray") {
            shapeCtx.moveTo(-rx * 0.45, ry * 0.6);
            shapeCtx.lineTo(-rx * 0.7, -ry * 0.5);
            shapeCtx.lineTo(-rx * 0.85, -ry);
            shapeCtx.lineTo(-rx * 0.25, -ry * 0.75);
            shapeCtx.lineTo(0, -ry * 1.05);
            shapeCtx.lineTo(rx * 0.25, -ry * 0.75);
            shapeCtx.lineTo(rx * 0.85, -ry);
            shapeCtx.lineTo(rx * 0.7, -ry * 0.5);
            shapeCtx.lineTo(rx * 0.45, ry * 0.6);
            shapeCtx.closePath();
          } else if (shape === "broad_cup") {
            shapeCtx.moveTo(0, ry * 0.6);
            shapeCtx.bezierCurveTo(-rx * 1.25, ry * 0.1, -rx * 1.35, -ry * 0.6, -rx * 0.5, -ry);
            shapeCtx.bezierCurveTo(0, -ry * 0.95, 0, -ry * 0.95, rx * 0.5, -ry);
            shapeCtx.bezierCurveTo(rx * 1.35, -ry * 0.6, rx * 1.25, ry * 0.1, 0, ry * 0.6);
          } else if (shape === "ruffled") {
            shapeCtx.moveTo(-rx * 0.3, ry * 0.5);
            shapeCtx.bezierCurveTo(-rx, -ry * 0.2, -rx * 1.1, -ry * 0.9, -rx * 0.3, -ry);
            shapeCtx.bezierCurveTo(0, -ry * 1.15, rx * 0.3, -ry, rx * 0.3, -ry);
            shapeCtx.bezierCurveTo(rx * 1.1, -ry * 0.9, rx, -ry * 0.2, rx * 0.3, ry * 0.5);
            shapeCtx.closePath();
          } else {
            shapeCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          }
          shapeCtx.fill();
        };

        for (let lIdx = 2; lIdx >= 0; lIdx--) {
          speciesPetals.forEach((petal, pIdx) => {
            if (petal.layer !== lIdx) return;
            const regrowth = stem.missingPetals.get(pIdx);
            let petalScale = 1.0;

            if (stem.isRegrowing) {
              const startThreshold = (2 - petal.layer) * 0.3;
              petalScale =
                stem.regrowProgress < startThreshold
                  ? 0
                  : Math.min(1.0, (stem.regrowProgress - startThreshold) * 3.5);
            } else if (regrowth !== undefined) {
              petalScale = Math.max(0, Math.min(1, (wallTime - regrowth.landedAt - 3000) / 400));
            }

            if (petalScale <= 0) return;

            const cx = Math.cos(petal.angle) * (petal.radius * baseScale);
            const cy = Math.sin(petal.angle) * (petal.radius * baseScale);

            shapeCtx.save();
            shapeCtx.translate(cx, cy);
            shapeCtx.rotate(petal.angle + Math.PI / 2);
            shapeCtx.scale(petalScale, petalScale);

            const rx = petal.width * 0.65 * baseScale;
            const ry = petal.height * 0.65 * baseScale;

            const petalGrad = shapeCtx.createLinearGradient(-rx * 0.75, -ry, rx * 0.75, ry);
            const midColor = lIdx === 2 ? flower.innerColor : flower.color;
            petalGrad.addColorStop(0, flower.highlight || "#ffffff");
            petalGrad.addColorStop(0.35, midColor);
            petalGrad.addColorStop(1, flower.innerColor);

            shapeCtx.fillStyle = petalGrad;
            drawSpeciesPetal(petal.shape, rx, ry);
            shapeCtx.restore();
          });
        }

        if (flower.type === "rose") {
          shapeCtx.strokeStyle = flower.innerColor;
          shapeCtx.lineWidth = 3.5 * scale;
          shapeCtx.beginPath();
          for (let a = 0; a < Math.PI * 3.5; a += 0.2) {
            const r = (a / (Math.PI * 3.5)) * (16 * baseScale);
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (a === 0) shapeCtx.moveTo(px, py);
            else shapeCtx.lineTo(px, py);
          }
          shapeCtx.stroke();
        } else if (flower.type === "poppy") {
          const poppyCoreGrad = shapeCtx.createRadialGradient(0, 0, 2, 0, 0, 14 * baseScale);
          poppyCoreGrad.addColorStop(0, "#1c1917");
          poppyCoreGrad.addColorStop(0.65, "#0c0a09");
          poppyCoreGrad.addColorStop(1, flower.innerColor);
          shapeCtx.fillStyle = poppyCoreGrad;
          shapeCtx.beginPath();
          shapeCtx.arc(0, 0, 13 * baseScale, 0, Math.PI * 2);
          shapeCtx.fill();
        }

        shapeCtx.restore();
      });

      // 7. DRAW FALLEN & SETTLED PETALS
      petalsRef.current.forEach((petal) => {
        shapeCtx.save();
        shapeCtx.translate(petal.x, petal.y);
        shapeCtx.rotate(petal.angle);

        const rx = (petal.width || petal.radius * 1.5) * 0.45;
        const ry = (petal.height || petal.radius * 2.2) * 0.45;
        const fallGrad = shapeCtx.createLinearGradient(-rx, -ry, rx, ry);
        fallGrad.addColorStop(0, petal.highlight || "#ffffff");
        fallGrad.addColorStop(0.35, petal.color);
        fallGrad.addColorStop(1, petal.innerColor);

        shapeCtx.fillStyle = fallGrad;
        shapeCtx.beginPath();
        if (petal.shape === "serrated_ray") {
          shapeCtx.moveTo(-rx * 0.5, ry);
          shapeCtx.lineTo(-rx * 0.8, -ry * 0.6);
          shapeCtx.lineTo(0, -ry);
          shapeCtx.lineTo(rx * 0.8, -ry * 0.6);
          shapeCtx.lineTo(rx * 0.5, ry);
        } else {
          shapeCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        }
        shapeCtx.fill();
        shapeCtx.restore();
      });

      // Reuse uploads until the surface changes size. The shared renderer owns
      // compilation, scheduling, resize rendering, and GPU lifecycle.
      const device = gpu.gpu;
      if (textureSize !== `${width}x${height}`) {
        shapeTexture?.destroy();
        glyphTexture?.destroy();
        const descriptor = {
          kind: "2d" as const,
          size: [width, height] as const,
          format: "rgba8unorm" as const,
          usage: ["texture_binding", "copy_dst", "render_attachment"] as const,
        };
        shapeTexture = texture(gpu, descriptor);
        glyphTexture = texture(gpu, descriptor);
        const scale = Math.min(width / 840, height / 360);
        const glyphs = buildGlyphField(width, height, Math.max(7.5, Math.round(8.5 * scale)));
        if (glyphs)
          device.queue.copyExternalImageToTexture(
            { source: glyphs },
            { texture: glyphTexture.gpu },
            [width, height],
          );
        textureSampler ??= sampler(gpu, { magFilter: "linear", minFilter: "linear" });
        textureSize = `${width}x${height}`;
      }
      device.queue.copyExternalImageToTexture(
        { source: shapeCanvas },
        { texture: shapeTexture!.gpu },
        [width, height],
      );
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      return {
        shapeTexture: shapeTexture!,
        glyphTexture: glyphTexture!,
        textureSampler: textureSampler!,
        uniforms: { resolution: [width, height], time: simTime, isDark: Number(dark) },
      };
    };

    return {
      render,
      dispose: () => {
        growthAnimation?.stop();
        shapeTexture?.destroy();
        glyphTexture?.destroy();
      },
    };
  }, [dark, buildGlyphField, reduceMotion, shedPetalsFromFlower]);

  useEffect(() => garden.dispose, [garden]);

  // Pointer movement tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const entering = mouseRef.current.x === -9999;
    mouseRef.current.x = (e.clientX - rect.left) * scaleX;
    mouseRef.current.y = (e.clientY - rect.top) * scaleY;
    if (entering) {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
    }
  };

  const handlePointerLeave = () => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    mouseRef.current.down = false;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!growthCompleteRef.current) return;
    mouseRef.current.down = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const width = canvas.width;
    const height = canvas.height;
    const groundY = height * 0.78;
    const scale = Math.min(width / 840, height / 360);
    const offsetX = (width - 800 * scale) / 2;

    FLOWERS_DATA.forEach((flower, idx) => {
      const stem = stemsRef.current[idx];
      const rootX = offsetX + flower.x * scale;
      const stemLength = flower.height * scale;
      const headX = rootX + Math.sin(stem.angle) * stemLength;
      const headY = groundY - Math.cos(stem.angle) * stemLength;

      const dist = Math.hypot(clickX - headX, clickY - headY);
      if (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        dist < 55 * flower.size * scale
      ) {
        shedPetalsFromFlower(idx, 3);
        stem.velocity += clickX < headX ? 4.5 : -4.5;
      }
    });
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!growthCompleteRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const width = canvas.width;
    const height = canvas.height;
    const groundY = height * 0.78;
    const scale = Math.min(width / 840, height / 360);
    const offsetX = (width - 800 * scale) / 2;

    FLOWERS_DATA.forEach((flower, idx) => {
      const stem = stemsRef.current[idx];
      const rootX = offsetX + flower.x * scale;
      const stemLength = flower.height * scale;
      const headX = rootX + Math.sin(stem.angle) * stemLength;
      const headY = groundY - Math.cos(stem.angle) * stemLength;

      const dist = Math.hypot(clickX - headX, clickY - headY);
      if (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        dist < 55 * flower.size * scale
      ) {
        stem.isRegrowing = true;
        stem.regrowProgress = 0.0;
        stem.velocity += (Math.random() - 0.5) * 8;
      }
    });
  };

  const handlePointerUp = () => {
    mouseRef.current.down = false;
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}
      className="relative flex-1 w-full h-full flex items-center justify-center cursor-crosshair"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onDoubleClick={handleDoubleClick}
    >
      <Canvas
        {...props}
        canvasRef={canvasRef}
        shader={binaryFlowerShader}
        label="binary-flower-garden"
        aria-label="Binary flower garden. Move over flowers to sway them, click to shed petals, and double-click to regrow them."
        fallback="linear-gradient(#141416, #141416)"
        lightFallback="linear-gradient(#f5f5f7, #f5f5f7)"
        uniforms={garden.render}
        fps={60}
        dpr={[1, 2]}
        className={cn("h-full min-h-0 w-full border-0 [&>div]:z-0", className)}
      />
    </motion.div>
  );
});
