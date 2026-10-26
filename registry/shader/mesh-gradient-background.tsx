import { memo, useId, type ComponentProps } from "react";
import { cn } from "cn";

export type MeshGradientBackgroundProps = ComponentProps<"div">;

export const MeshGradientBackground = memo(function MeshGradientBackground({
  className,
  children,
  ...props
}: MeshGradientBackgroundProps = {}) {
  const id = useId();

  return (
    <div
      {...props}
      data-slot="mesh-gradient-background"
      className={cn(
        "hangry-background relative isolate min-h-96 overflow-hidden border border-border bg-[#11152f]",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      >
        <defs>
          <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#11152f" />
            <stop offset="0.5" stopColor="#25215c" />
            <stop offset="1" stopColor="#081d3d" />
          </linearGradient>
          <radialGradient id={`${id}-pink`}>
            <stop stopColor="#f472b6" stopOpacity="0.95" />
            <stop offset="1" stopColor="#f472b6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-gold`}>
            <stop stopColor="#facc15" stopOpacity="0.9" />
            <stop offset="1" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-cyan`}>
            <stop stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="55" />
          </filter>
          <pattern id={`${id}-dots`} width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#ffffff" fillOpacity="0.16" />
          </pattern>
        </defs>
        <rect width="1200" height="700" fill={`url(#${id}-base)`} />
        <g filter={`url(#${id}-blur)`}>
          <ellipse cx="180" cy="120" rx="360" ry="250" fill={`url(#${id}-pink)`} />
          <ellipse cx="900" cy="90" rx="330" ry="220" fill={`url(#${id}-gold)`} />
          <ellipse cx="700" cy="620" rx="430" ry="260" fill={`url(#${id}-cyan)`} />
        </g>
        <path
          d="M0 470C190 330 320 560 500 430S820 270 1200 430V700H0Z"
          fill="#0b1638"
          fillOpacity="0.42"
        />
        <rect width="1200" height="700" fill={`url(#${id}-dots)`} />
      </svg>
      {children}
    </div>
  );
});
