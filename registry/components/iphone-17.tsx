import { memo, useId } from "react";

const finishes = {
  sage: { body: "#bdc8b2", edge: "#747e6b", light: "#e6ebdf", accent: "#789479" },
  lavender: { body: "#d6cfe6", edge: "#898096", light: "#f0eaf7", accent: "#9a83be" },
  "mist-blue": { body: "#c4d2df", edge: "#788796", light: "#edf3f7", accent: "#7e9fbf" },
  black: { body: "#343535", edge: "#151616", light: "#747878", accent: "#707e8c" },
  white: { body: "#e8e8e3", edge: "#9b9c97", light: "#ffffff", accent: "#a4adb6" },
} as const;

interface IPhone17Props {
  color?: keyof typeof finishes;
  className?: string;
  label?: string;
}

export const IPhone17 = memo(function IPhone17({
  color = "sage",
  className = "",
  label = "iPhone 17 front illustration",
}: IPhone17Props = {}) {
  const id = useId();
  const finish = finishes[color];
  const ref = (name: string) => `url(#${id}-${name})`;

  return (
    <svg role="img" aria-labelledby={`${id}-title`} viewBox="0 0 360 666" fill="none" className={`mx-auto h-auto w-full max-w-sm ${className}`}>
      <title id={`${id}-title`}>{label}</title>
      <defs>
        <linearGradient id={`${id}-frame`} x1="0" y1="0" x2="280" y2="580" gradientUnits="userSpaceOnUse">
          <stop stopColor={finish.light} /><stop offset="0.15" stopColor={finish.edge} />
          <stop offset="0.48" stopColor={finish.body} /><stop offset="0.72" stopColor={finish.light} /><stop offset="1" stopColor={finish.edge} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="30" y1="15" x2="250" y2="570" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.24" /><stop offset="0.5" stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" stopOpacity="0.07" />
        </linearGradient>
        <linearGradient id={`${id}-screen`} x1="30" y1="0" x2="250" y2="580" gradientUnits="userSpaceOnUse">
          <stop stopColor={finish.light} /><stop offset="0.45" stopColor={finish.body} /><stop offset="1" stopColor={finish.accent} />
        </linearGradient>
        <linearGradient id={`${id}-ribbon`} x1="80" y1="180" x2="270" y2="470" gradientUnits="userSpaceOnUse">
          <stop stopColor={finish.light} /><stop offset="0.5" stopColor={finish.accent} /><stop offset="1" stopColor="#1c3735" />
        </linearGradient>
        <radialGradient id={`${id}-lens`}>
          <stop stopColor="#353966" /><stop offset="0.5" stopColor="#152f3b" /><stop offset="1" stopColor="#080d16" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-50%" y="-25%" width="200%" height="160%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="8" dy="24" stdDeviation="18" floodColor="#000" floodOpacity="0.35" />
        </filter>
        <clipPath id={`${id}-display`}><rect x="11" y="11" width="258" height="564" rx="39" /></clipPath>
      </defs>

      {/* Front device: thin bezel, Dynamic Island, and an original abstract wallpaper. */}
      <g transform="translate(40 40)" filter={ref("shadow")}>
        <rect x="-2" y="96" width="4" height="27" rx="2" fill={finish.edge} />
        <rect x="-2" y="145" width="4" height="45" rx="2" fill={finish.edge} />
        <rect x="-2" y="201" width="4" height="45" rx="2" fill={finish.edge} />
        <rect x="278" y="154" width="4" height="64" rx="2" fill={finish.edge} />
        <rect x="278" y="352" width="4" height="48" rx="2" fill={finish.edge} />
        <rect width="280" height="586" rx="47" fill={ref("frame")} stroke={finish.light} strokeOpacity="0.6" />
        <rect x="4" y="4" width="272" height="578" rx="43" fill="#080a09" stroke="#151a17" />
        <g clipPath={ref("display")}>
          <rect x="11" y="11" width="258" height="564" fill={ref("screen")} />
          <path d="M-60 465C10 205 199 191 279 316c66 103-57 188-141 159-86-30-38-132 29-104 43 18 7 70-19 51" stroke={ref("ribbon")} strokeWidth="91" />
          <path d="M-60 465C10 205 199 191 279 316c66 103-57 188-141 159-86-30-38-132 29-104 43 18 7 70-19 51" stroke={finish.light} strokeOpacity="0.65" strokeWidth="2" />
          <rect x="11" y="11" width="258" height="564" fill={ref("glass")} />
          <text x="140" y="106" textAnchor="middle" fill="#1c302b" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="500">Wednesday, September 17</text>
          <text x="140" y="177" textAnchor="middle" fill="#1c302b" fontFamily="system-ui, sans-serif" fontSize="74" fontWeight="600" letterSpacing="-5">9:41</text>
          <g fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.2">
            <circle cx="53" cy="527" r="19" /><circle cx="227" cy="527" r="19" />
          </g>
          <path d="M49 521h8l-2 5v9h-4v-9l-2-5Zm1-3h6" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="218" y="522" width="18" height="12" rx="3" stroke="white" strokeWidth="1.5" />
          <circle cx="227" cy="528" r="3.5" stroke="white" strokeWidth="1.5" />
          <rect x="221" y="519" width="6" height="3" rx="1" fill="white" />
        </g>
        <rect x="97" y="21" width="86" height="25" rx="12.5" fill="#030504" />
        <circle cx="170" cy="33.5" r="5" fill={ref("lens")} />
        <circle cx="169" cy="32" r="1.5" fill="#56687c" opacity="0.55" />
        <rect x="97" y="560" width="86" height="4" rx="2" fill="white" fillOpacity="0.8" />
        <path d="M4 57v-9C4 24 24 4 48 4h184" stroke="white" strokeOpacity="0.6" />
      </g>
    </svg>
  );
});
