import { memo } from "react";
import { cn } from "cn";

export type BrandColor = {
  name: string;
  hex: string;
  foreground: string;
  token: string;
};

export const brandColors: BrandColor[] = [
  { name: "Spring Green", hex: "#05dc7f", foreground: "#152e2b", token: "--color-spring-green" },
  { name: "Green", hex: "#00664e", foreground: "#dbe3e6", token: "--color-brand-green" },
  { name: "Dark Green", hex: "#152e2b", foreground: "#dbe3e6", token: "--color-dark-green" },
  { name: "White", hex: "#dbe3e6", foreground: "#152e2b", token: "--color-palette-white" },
  { name: "Gray", hex: "#1f1f1f", foreground: "#dbe3e6", token: "--color-palette-gray" },
  { name: "Black", hex: "#000000", foreground: "#dbe3e6", token: "--color-black" },
];

export const lightModeColors: BrandColor[] = [
  { name: "Paper", hex: "#f4faf6", foreground: "#113c32", token: "--color-light-paper" },
  { name: "Surface", hex: "#d8eee2", foreground: "#113c32", token: "--color-light-surface" },
  { name: "Ink", hex: "#113c32", foreground: "#f4faf6", token: "--color-light-ink" },
  { name: "Emerald", hex: "#007c58", foreground: "#f4faf6", token: "--color-light-emerald" },
  { name: "Cyan", hex: "#008bb8", foreground: "#000000", token: "--color-light-cyan" },
  { name: "Blue", hex: "#285ee8", foreground: "#f4faf6", token: "--color-light-blue" },
  { name: "Violet", hex: "#8244d8", foreground: "#f4faf6", token: "--color-light-violet" },
  { name: "Rose", hex: "#d63c83", foreground: "#000000", token: "--color-light-rose" },
  { name: "Gold", hex: "#d7931d", foreground: "#113c32", token: "--color-light-gold" },
];

export type BrandPaletteProps = {
  colors?: BrandColor[];
  showLabels?: boolean;
  className?: string;
};

export const BrandPalette = memo(function BrandPalette({
  colors = brandColors,
  showLabels = false,
  className,
}: BrandPaletteProps = {}) {
  return (
    <section aria-label="Brand color palette" className={cn("w-[640px] max-w-full", className)}>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {colors.map((color, index) => (
          <li
            key={color.token}
            aria-label={color.name}
            className={cn(
              "flex min-w-0 flex-col items-start justify-end gap-8 border border-white/15 p-4 text-left",
              index < 3 ? "h-52" : "h-36",
            )}
            style={{ backgroundColor: color.hex, color: color.foreground }}
          >
            {showLabels && (
              <div className="space-y-1">
                <span className="block text-sm font-medium">{color.name}</span>
                <code className="text-xs">{color.hex}</code>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="mt-2 h-24 border border-border"
        style={{
          background: `linear-gradient(120deg, ${colors.map((color) => color.hex).join(", ")})`,
        }}
      />
    </section>
  );
});
