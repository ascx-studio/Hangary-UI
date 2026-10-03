"use client";

import { useState } from "react";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}

export function Avatar({
  src,
  name = "Alex Morgan",
  size = 48,
  className = "",
}: AvatarProps = {}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  // Registry consumers can use any React framework and image URL.
  /* eslint-disable @next/next/no-img-element */
  return (
    <span
      role="img"
      aria-label={name}
      style={{ width: size, height: size }}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden border border-border bg-emerald-400/15 text-sm font-semibold text-emerald-300 ${className}`}
    >
      {src && failedSrc !== src ? (
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          onError={() => setFailedSrc(src)}
          className="h-full w-full object-cover"
        />
      ) : (
        initials || "?"
      )}
    </span>
  );
}
