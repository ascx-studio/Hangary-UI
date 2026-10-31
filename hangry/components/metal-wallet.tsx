"use client";

import { memo, useId, useState } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { cn } from "cn";
import { Button } from "@/hangry/components/button";

const springGreen = "var(--color-spring-green, #05dc7f)";
const green = "var(--color-brand-green, #00664e)";
const darkGreen = "var(--color-dark-green, #152e2b)";
const brandTheme = {
  backInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0",
  flapFillOpacity: 0.45,
  flapInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0",
  cardFill: "var(--color-palette-white, #dbe3e6)",
  cardStroke: green,
  cardLineFill: darkGreen,
} as const;
const themes = {
  "spring-green": {
    ...brandTheme,
    backFill: springGreen,
    flapFill: springGreen,
    flapStroke: green,
  },
  green: { ...brandTheme, backFill: green, flapFill: green, flapStroke: springGreen },
  "dark-green": { ...brandTheme, backFill: darkGreen, flapFill: darkGreen, flapStroke: green },
  white: {
    backFill: "#ffffff",
    backInsetColor: "0 0 0 0 0.7 0 0 0 0 0.7 0 0 0 0 0.7 0 0 0 0.25 0",
    flapFill: "#f5f5f5",
    flapFillOpacity: 0.85,
    flapStroke: "#d4d4d4",
    flapInsetColor: "0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0.15 0",
    cardFill: "#262626",
    cardStroke: "#404040",
    cardLineFill: "#737373",
  },
} as const;
const widths = { sm: 390, md: 480, lg: 600 } as const;
const front =
  "M0 25C0 11.1929 11.1929 0 25 0H136.084C143.044 0 149.689 2.90139 154.42 8.00608L178.08 33.5343C182.811 38.639 189.456 41.5404 196.416 41.5404H296C309.807 41.5404 321 52.7333 321 66.5404V216C321 229.807 309.807 241 296 241H25C11.1929 241 0 229.807 0 216V25Z";
type WalletTheme = (typeof themes)[keyof typeof themes];

const WalletCard = memo(function WalletCard({ theme }: { theme: WalletTheme }) {
  return (
    <g data-slot="wallet-card" transform="rotate(-90)">
      <rect
        x="-82"
        y="-107"
        width="164"
        height="214"
        rx="20"
        fill={theme.cardFill}
        stroke={theme.cardStroke}
      />
      <rect x="-67" y="-76" width="134" height="12" rx="6" fill={theme.cardLineFill} />
      {Array.from({ length: 9 }, (_, index) => (
        <g key={index} fill={theme.cardLineFill}>
          <rect x="-67" y={-46 + index * 14} width="64" height="6" rx="3" />
          <rect x="3" y={-46 + index * 14} width="64" height="6" rx="3" />
        </g>
      ))}
    </g>
  );
});

export type MetalWalletProps = {
  color?: "spring-green" | "green" | "dark-green" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

export const MetalWallet = memo(function MetalWallet({
  color = "spring-green",
  size = "md",
  className,
  label = "Metal wallet",
}: MetalWalletProps = {}) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = themes[color];
  const active = hovered || open;
  const transition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 120, damping: 14 };

  const cards = [
    { y: open ? -90 : active ? -30 : -10, x: 40, rotate: active ? 14 : 10 },
    { y: open ? -95 : active ? -35 : -20, x: 3, rotate: active ? -1 : 2 },
    { y: open ? -104 : active ? -44 : -22, x: -40, rotate: active ? -9 : -5 },
  ];

  return (
    <Button
      variant="ghost"
      aria-label={label}
      aria-pressed={open}
      data-slot="metal-wallet"
      data-color={color}
      data-size={size}
      className={cn(
        "relative block! h-auto max-w-full select-none p-0! hover:bg-transparent focus-visible:outline-ring",
        className,
      )}
      style={{
        width: widths[size],
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
        setOpen(false);
      }}
      onBlur={() => {
        setHovered(false);
        setOpen(false);
      }}
      onClick={() => setOpen((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          setHovered(false);
        }
      }}
    >
      <svg
        viewBox="-120 -40 540 440"
        aria-hidden="true"
        className="pointer-events-none block h-auto w-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`${id}-shadow`} x="-30%" y="-20%" width="170%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#000" floodOpacity="0.25" />
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
          </filter>
          <filter id={`${id}-back-inset`} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feComposite in="SourceAlpha" in2="blur" operator="out" />
            <feColorMatrix type="matrix" values={theme.backInsetColor} result="inset" />
            <feBlend in="SourceGraphic" in2="inset" />
          </filter>
          <filter id={`${id}-front-inset`} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.65" result="blur" />
            <feComposite in="SourceAlpha" in2="blur" operator="out" />
            <feColorMatrix type="matrix" values={theme.flapInsetColor} result="inset" />
            <feBlend in="SourceGraphic" in2="inset" />
          </filter>
          <filter id={`${id}-frost`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <clipPath id={`${id}-pocket`}>
            <path d={front} />
          </clipPath>
        </defs>
        <g transform="translate(300 30) rotate(90)">
          <g filter={`url(#${id}-shadow)`}>
            <g id={`${id}-contents`}>
              <rect
                data-slot="wallet-back"
                width="321"
                height="270"
                rx="25"
                fill={theme.backFill}
                filter={`url(#${id}-back-inset)`}
              />
              <g transform="translate(160.5 135)">
                {cards.map((position, index) => (
                  <motion.g
                    key={index}
                    initial={false}
                    data-slot="wallet-card-motion"
                    animate={position}
                    transition={{
                      ...transition,
                      delay: reducedMotion ? 0 : active ? (2 - index) * 0.06 : 0,
                    }}
                  >
                    <WalletCard theme={theme} />
                  </motion.g>
                ))}
              </g>
            </g>
            <g transform="translate(0 30.5)">
              <motion.g
                initial={false}
                data-slot="wallet-front"
                style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                animate={{ x: 0, y: open ? 100 : hovered ? 32 : 0, scaleY: 0.966 }}
                transition={transition}
              >
                <g clipPath={`url(#${id}-pocket)`}>
                  <use
                    href={`#${id}-contents`}
                    transform="translate(0 -30.5)"
                    filter={`url(#${id}-frost)`}
                  />
                </g>
                <path
                  data-slot="wallet-front-tint"
                  d={front}
                  fill={theme.flapFill}
                  fillOpacity={theme.flapFillOpacity}
                  stroke={theme.flapStroke}
                  strokeWidth="1"
                  filter={`url(#${id}-front-inset)`}
                />
              </motion.g>
            </g>
          </g>
        </g>
      </svg>
    </Button>
  );
});
