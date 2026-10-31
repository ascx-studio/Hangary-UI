"use client";

import { memo, useEffect, type ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";

const portfolioLogo = (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" fill="white" />
    <path
      d="M12 26H8V6H20V10H12V14H20V18H12V26ZM24 14H20V10H24V14ZM24 26H20V18H24V26Z"
      fill="black"
    />
  </svg>
);

const SHAPE_SELECTOR =
  "svg path, svg circle, svg ellipse, svg line, svg polygon, svg polyline, svg rect";

type LogoAnimationProps = {
  /** Any logo component or inline SVG. Its vector shapes are drawn in sequence. */
  logo?: ReactNode;
  /** SVG artwork can also be passed as children. */
  children?: ReactNode;
  /** Square logo size in pixels; overridden by width or height. */
  size?: number;
  width?: number;
  height?: number;
  /** Accessible description for the logo. */
  alt?: string;
  className?: string;
  onAnimationComplete?: () => void;
};

export const LogoAnimation = memo(function LogoAnimation({
  logo,
  children,
  size = 48,
  width = size,
  height = size,
  alt = "Portfolio logo",
  className,
  onAnimationComplete,
}: LogoAnimationProps = {}) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduceMotion = useReducedMotion();
  const artwork = logo ?? children ?? portfolioLogo;

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (reduceMotion) {
      onAnimationComplete?.();
      return;
    }

    let cancelled = false;
    const notifyWhenFinished = (controls: Array<{ finished: Promise<unknown> }>) => {
      void Promise.all(controls.map((control) => control.finished))
        .then(() => {
          if (!cancelled) onAnimationComplete?.();
        })
        .catch(() => {});
    };

    const shapes = [...root.querySelectorAll<SVGGeometryElement>(SHAPE_SELECTOR)].filter(
      (shape) =>
        !shape.closest("defs, clipPath, mask, pattern, linearGradient, radialGradient, filter"),
    );

    if (shapes.length === 0) {
      const controls = animate(
        root,
        { opacity: [0, 1], scale: [0.96, 1] },
        { duration: 0.45, ease: "easeOut" },
      );
      notifyWhenFinished([controls]);
      return () => {
        cancelled = true;
        controls.stop();
      };
    }

    const controls: Array<{ stop: () => void; finished: Promise<unknown> }> = [];
    const originals = shapes.map((shape) => ({
      shape,
      pathLength: shape.getAttribute("pathLength"),
      stroke: shape.style.stroke,
      strokeWidth: shape.style.strokeWidth,
      strokeDasharray: shape.style.strokeDasharray,
      strokeDashoffset: shape.style.strokeDashoffset,
      fillOpacity: shape.style.fillOpacity,
    }));

    shapes.forEach((shape, index) => {
      const computed = window.getComputedStyle(shape);
      const fillIsVisible = computed.fill !== "none";

      if (computed.stroke === "none" && fillIsVisible) {
        shape.style.stroke = computed.fill;
        if (Number.parseFloat(computed.strokeWidth) === 0) shape.style.strokeWidth = "1";
      }

      shape.setAttribute("pathLength", "1");
      shape.style.strokeDasharray = "1";
      shape.style.strokeDashoffset = "1";
      if (fillIsVisible) shape.style.fillOpacity = "0";

      controls.push(
        animate(
          shape,
          {
            strokeDashoffset: [1, 0],
            ...(fillIsVisible
              ? { fillOpacity: [0, Number.parseFloat(computed.fillOpacity) || 1] }
              : {}),
          },
          { duration: 1.1, delay: index * 0.1, ease: [0.42, 0, 0.58, 1] },
        ),
      );
    });
    notifyWhenFinished(controls);

    return () => {
      cancelled = true;
      controls.forEach((control) => control.stop());
      for (const original of originals) {
        if (original.pathLength === null) original.shape.removeAttribute("pathLength");
        else original.shape.setAttribute("pathLength", original.pathLength);
        original.shape.style.stroke = original.stroke;
        original.shape.style.strokeWidth = original.strokeWidth;
        original.shape.style.strokeDasharray = original.strokeDasharray;
        original.shape.style.strokeDashoffset = original.strokeDashoffset;
        original.shape.style.fillOpacity = original.fillOpacity;
      }
    };
  }, [animate, artwork, onAnimationComplete, reduceMotion, scope]);

  return (
    <div
      ref={scope}
      role="img"
      aria-label={alt}
      className={[
        "inline-flex [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_svg]:h-full [&_svg]:w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height }}
    >
      {artwork}
    </div>
  );
});
