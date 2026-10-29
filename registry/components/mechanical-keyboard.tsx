import { memo, useId } from "react";
import * as motion from "motion/react-client";
import { cn } from "cn";

const palette = {
  white: "var(--color-palette-white, #dbe3e6)",
  spring: "var(--color-spring-green, #05dc7f)",
  green: "var(--color-brand-green, #00664e)",
  darkGreen: "var(--color-dark-green, #152e2b)",
  gray: "var(--color-palette-gray, #1f1f1f)",
  black: "var(--color-black, #000000)",
};

const rows = [
  { color: palette.white, y: 17, height: 16, units: Array(15).fill(1) as number[] },
  {
    color: `color-mix(in srgb, ${palette.spring} 35%, ${palette.white})`,
    y: 39,
    height: 25,
    units: Array(15).fill(1) as number[],
  },
  { color: palette.spring, y: 69, height: 25, units: [1.5, ...Array(12).fill(1), 1.5] as number[] },
  {
    color: palette.green,
    y: 99,
    height: 25,
    units: [1.75, ...Array(11).fill(1), 2.25] as number[],
  },
  {
    color: palette.darkGreen,
    y: 129,
    height: 25,
    units: [2.25, ...Array(10).fill(1), 2.75] as number[],
  },
  {
    color: palette.gray,
    y: 159,
    height: 25,
    units: [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
  },
];

const Keycap = memo(function Keycap({
  x,
  y,
  width,
  height,
  color,
  light,
  delay,
  colorDelay,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  light: string;
  delay: number;
  colorDelay: number;
}) {
  return (
    <motion.g
      data-slot="keyboard-key"
      className="motion-reduce:opacity-100! motion-reduce:transform-none!"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3, delay, ease: "easeOut" } },
      }}
    >
      <motion.g
        data-slot="keyboard-key-color"
        className="motion-reduce:opacity-100!"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 0.4, delay: colorDelay, ease: [0.22, 1, 0.36, 1] },
          },
        }}
      >
        <rect x={x} y={y + 3} width={width} height={height} rx="2" fill={palette.black} />
        <rect x={x} y={y} width={width} height={height - 1} rx="2" fill={color} />
        <rect x={x} y={y} width={width} height={height - 1} rx="2" fill={light} />
        <path
          d={`M${x + 2} ${y + 1}H${x + width - 2}`}
          stroke={palette.white}
          strokeOpacity="0.18"
          strokeWidth="0.6"
        />
      </motion.g>
      <rect
        data-slot="keyboard-key-outline"
        x={x}
        y={y}
        width={width}
        height={height - 1}
        rx="2"
        fill="none"
        stroke={palette.white}
        strokeOpacity="0.25"
        strokeWidth="0.7"
      />
    </motion.g>
  );
});

export type MechanicalKeyboardProps = {
  className?: string;
  label?: string;
};

export const MechanicalKeyboard = memo(function MechanicalKeyboard({
  className,
  label = "Mechanical keyboard with brand-colored keycaps",
}: MechanicalKeyboardProps = {}) {
  const id = useId();

  return (
    <motion.svg
      viewBox="0 0 540 240"
      role="img"
      aria-label={label}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={cn("h-auto w-160 max-w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}-case`} x2="0" y2="1">
          <stop stopColor={palette.gray} />
          <stop offset="1" stopColor={palette.black} />
        </linearGradient>
        <linearGradient id={`${id}-key-light`} x2="0" y2="1">
          <stop stopColor={palette.white} stopOpacity="0.12" />
          <stop offset="0.35" stopColor={palette.white} stopOpacity="0" />
          <stop offset="1" stopColor={palette.black} stopOpacity="0.15" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-15%" y="-25%" width="140%" height="180%">
          <feDropShadow
            dx="2"
            dy="9"
            stdDeviation="7"
            floodColor={palette.black}
            floodOpacity="0.35"
          />
        </filter>
      </defs>
      <g transform="translate(16 16)" filter={`url(#${id}-shadow)`}>
        <motion.g
          data-slot="keyboard-case"
          className="motion-reduce:opacity-100!"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 1.2, duration: 0.45, ease: "easeInOut" } },
          }}
        >
          <rect x="0" y="9" width="508" height="194" rx="7" fill={palette.black} />
          <rect width="508" height="194" rx="7" fill={`url(#${id}-case)`} />
          <rect
            data-slot="keyboard-plate"
            x="8"
            y="13"
            width="489"
            height="176"
            rx="3"
            fill={palette.black}
          />
        </motion.g>
        <motion.rect
          data-slot="keyboard-outline"
          width="508"
          height="194"
          rx="7"
          fill="none"
          stroke={palette.spring}
          strokeWidth="1.5"
          className="motion-reduce:[stroke-dasharray:none]! motion-reduce:[stroke-dashoffset:0]!"
          variants={{
            hidden: { pathLength: 0, stroke: palette.spring },
            visible: {
              pathLength: 1,
              stroke: palette.darkGreen,
              transition: {
                pathLength: { duration: 0.85, ease: "easeInOut" },
                stroke: { delay: 0.9, duration: 0.25 },
              },
            },
          }}
        />
        <motion.g
          data-slot="keyboard-details"
          className="motion-reduce:opacity-100!"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 1.4, duration: 0.3, ease: "easeOut" } },
          }}
        >
          <path d="M8 3H497" stroke={palette.white} strokeOpacity="0.08" />
          <circle cx="18" cy="8" r="1.5" fill={palette.spring} />
          <circle cx="24" cy="8" r="1.5" fill={palette.green} opacity="0.6" />
          <circle
            cx="495"
            cy="8"
            r="5"
            fill={palette.black}
            stroke={palette.gray}
            strokeWidth="0.9"
          />
          <circle
            cx="495"
            cy="8"
            r="2.5"
            fill="none"
            stroke={palette.spring}
            strokeOpacity="0.45"
            strokeWidth="0.6"
          />
        </motion.g>
        {rows.map((row, rowIndex) => {
          let offset = 0;
          return (
            <g key={rowIndex} data-slot="keyboard-row">
              {row.units.map((units, keyIndex) => {
                const x = 12 + offset * 32;
                offset += units;
                return (
                  <Keycap
                    key={keyIndex}
                    x={x}
                    y={row.y}
                    width={units * 32 - 4}
                    height={row.height}
                    color={row.color}
                    light={`url(#${id}-key-light)`}
                    delay={1.75 + rowIndex * 0.1}
                    colorDelay={2.7 + ((x - 12) / 480) * 0.85}
                  />
                );
              })}
            </g>
          );
        })}
      </g>
    </motion.svg>
  );
});
