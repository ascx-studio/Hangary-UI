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

export type BrandPaletteProps = {
  colors?: BrandColor[];
  className?: string;
};

export const BrandPalette = memo(function BrandPalette({
  colors = brandColors,
  className,
}: BrandPaletteProps = {}) {
  return (
    <section aria-label="Brand color palette" className={cn("w-[640px] max-w-full", className)}>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {colors.map((color, index) => (
          <li key={color.token}
            aria-label={color.name}
            className={cn("flex min-w-0 flex-col items-start justify-end gap-8 border border-white/15 p-4 text-left", index < 3 ? "h-52" : "h-36")}
            style={{ backgroundColor: color.hex, color: color.foreground }}
          >
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="mt-2 h-24 border border-border" style={{ background: "linear-gradient(120deg, #05dc7f, #00664e 50%, #152e2b)" }} />
    </section>
  );
});
