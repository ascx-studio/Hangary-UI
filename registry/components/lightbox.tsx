"use client";

import { memo, useEffect, useRef, useState, type ComponentProps } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { typography } from "../lib/typography.shared";

/* eslint-disable @next/next/no-img-element */

interface LightboxProps extends Omit<ComponentProps<"button">, "children" | "onClick" | "type"> {
  src: string;
  alt: string;
  caption?: string;
  triggerLabel?: string;
}

export const Lightbox = memo(function Lightbox({
  src,
  alt,
  caption,
  triggerLabel = "View image",
  className = "",
  ...props
}: LightboxProps) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) dialog.showModal();
    const scrollY = window.scrollY;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <>
      <button
        {...props}
        type="button"
        aria-label={`Open image: ${alt}`}
        onClick={() => {
          setZoom(1);
          setOpen(true);
        }}
        className={`mx-auto flex w-fit items-center gap-3 border border-border bg-background py-1.5 pl-1.5 pr-4 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring ${className}`}
      >
        <img src={src} alt="" loading="lazy" className="size-12 object-cover" />
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={caption ?? alt}
        onClose={() => setOpen(false)}
        className="m-auto max-h-[90dvh] max-w-[92vw] overflow-visible border-0 bg-transparent p-0 text-foreground backdrop:bg-black/80"
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close image overlay"
          onClick={() => dialogRef.current?.close()}
          className="fixed inset-0 z-0 size-full border-0 bg-transparent p-0"
        />
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
          animate={open || reducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
          className="relative z-10 flex max-h-[90dvh] max-w-[92vw] flex-col items-center gap-3 pt-12"
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => dialogRef.current?.close()}
            className="absolute right-0 top-0 inline-flex size-10 items-center justify-center border border-border bg-background text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          <div className="max-h-[82dvh] max-w-[92vw] overflow-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              aria-label={zoom > 1 ? "Reset image zoom" : "Zoom image"}
              title="Double-click to zoom or reset"
              onDoubleClick={() => setZoom((value) => value > 1 ? 1 : 2)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                setZoom((value) => value > 1 ? 1 : 2);
              }}
              data-zoomed={zoom > 1}
              className="block cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-ring data-[zoomed=true]:cursor-zoom-out"
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[82dvh] max-w-[92vw] origin-center object-contain"
                style={{ transform: `scale(${zoom})`, transition: reducedMotion ? "none" : "transform 180ms ease-out" }}
              />
            </button>
          </div>
          {caption && <p className={`${typography.caption} text-center text-white`}>{caption}</p>}
        </motion.div>
      </dialog>
    </>
  );
});
