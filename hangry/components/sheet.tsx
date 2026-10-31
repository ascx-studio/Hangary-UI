"use client";

import { memo, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { LazyMotion, domAnimation, useAnimationControls, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Button } from "./button";
import { Card } from "./card";

interface SheetProps {
  side?: "top" | "right" | "bottom" | "left";
  triggerLabel?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const Sheet = memo(function Sheet({
  side = "bottom",
  triggerLabel = "Open sheet",
  title = "Make yourself at home",
  description = "A little space for your next action. Press Escape or close to return.",
  children,
  className = "",
}: SheetProps = {}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const animation = useAnimationControls();
  const textAnimation = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const closing = useRef(false);

  const horizontal = side === "left" || side === "right";
  const translate = (value: string | number) =>
    horizontal ? { x: value, y: 0 } : { x: 0, y: value };
  const offset =
    side === "left" || side === "top"
      ? "calc(-100% - var(--spacing) * 4)"
      : "calc(100% + var(--spacing) * 4)";
  const placement = {
    bottom: "inset-x-0 bottom-4 top-auto mx-auto max-h-[85dvh] w-full sm:max-w-xl",
    top: "inset-x-0 top-4 bottom-auto mx-auto max-h-[85dvh] w-full sm:max-w-xl",
    left: "top-1/2 bottom-auto left-4 right-auto -translate-y-1/2 max-h-[calc(100dvh-var(--spacing)*8)] w-[calc(100%-var(--spacing)*8)] sm:max-w-md",
    right:
      "top-1/2 bottom-auto right-4 left-auto -translate-y-1/2 max-h-[calc(100dvh-var(--spacing)*8)] w-[calc(100%-var(--spacing)*8)] sm:max-w-md",
  }[side];
  const expandedWidth = horizontal ? "calc(100% - var(--spacing) * 8)" : "100%";
  const expandedHeight = horizontal ? "calc(100dvh - var(--spacing) * 8)" : "auto";

  const textVariants = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : "calc(var(--spacing) * 3)",
      transition: { duration: reducedMotion ? 0 : 0.12 },
    },
    visible: { opacity: 1, y: 0 },
  };

  const openSheet = async () => {
    const sheet = dialog.current;
    if (!sheet || sheet.open) return;
    textAnimation.set("hidden");
    animation.set({ x: 0, y: 0, opacity: 0, width: expandedWidth, height: expandedHeight });
    // Motion renders on the next frame; measure the natural size immediately on reopen.
    sheet.style.width = expandedWidth;
    sheet.style.height = expandedHeight;
    sheet.showModal();
    const { width, height } = sheet.getBoundingClientRect();
    const handle = sheet.querySelector<HTMLElement>("[data-slot=sheet-handle]")!;
    const spacing = parseFloat(getComputedStyle(handle)[horizontal ? "width" : "height"]);
    sheet.style.overflow = "hidden";
    animation.set({
      width: reducedMotion ? width : Math.min(spacing * 36, width),
      height: reducedMotion ? height : Math.min(spacing * 16, height),
      ...translate(reducedMotion ? 0 : offset),
      opacity: 0,
    });
    await animation.start({
      ...translate(0),
      opacity: 1,
      transition: reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 30 },
    });
    if (!sheet.open || closing.current) return;
    await animation.start({
      width,
      height,
      transition: { duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] },
    });
    if (!sheet.open || closing.current) return;
    animation.set({ width: expandedWidth, height: expandedHeight });
    sheet.style.overflow = "";
    void textAnimation.start("visible");
  };

  const closeSheet = async () => {
    const sheet = dialog.current;
    if (!sheet?.open || closing.current) return;
    closing.current = true;
    animation.stop();
    textAnimation.stop();
    sheet.style.overflow = "hidden";
    const { width, height } = sheet.getBoundingClientRect();
    const handle = sheet.querySelector<HTMLElement>("[data-slot=sheet-handle]")!;
    const spacing = parseFloat(getComputedStyle(handle)[horizontal ? "width" : "height"]);
    animation.set({ width, height });
    await textAnimation.start("hidden");
    await animation.start({
      width: reducedMotion ? width : Math.min(spacing * 36, width),
      height: reducedMotion ? height : Math.min(spacing * 16, height),
      transition: { duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] },
    });
    await animation.start({
      ...translate(reducedMotion ? 0 : offset),
      opacity: 0,
      transition: { duration: reducedMotion ? 0 : 0.2, ease: "easeIn" },
    });
    sheet.close();
    sheet.style.overflow = "";
    closing.current = false;
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <div className={className}>
        <Button type="button" aria-haspopup="dialog" onClick={() => void openSheet()}>
          {triggerLabel}
        </Button>
        <m.dialog
          ref={(node) => {
            dialog.current = node;
            node?.setAttribute("closedby", "any");
          }}
          initial={{ ...translate(offset), opacity: 0 }}
          animate={animation}
          onCancel={(event) => {
            event.preventDefault();
            void closeSheet();
          }}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
          data-side={side}
          className={`fixed my-0 max-w-none overflow-x-hidden overflow-y-auto rounded-lg surface-raised p-0 text-card-foreground backdrop:bg-black/60 ${placement}`}
        >
          {horizontal && (
            <div
              aria-hidden="true"
              data-slot="sheet-handle"
              className={`pointer-events-none absolute top-1/2 z-10 h-10 w-1 -translate-y-1/2 bg-muted-foreground/40 ${side === "left" ? "right-2" : "left-2"}`}
            />
          )}
          <Card
            title=""
            description=""
            className={`relative max-w-none! border-0! ${horizontal ? "min-h-full" : ""}`}
          >
            <m.div
              className="absolute right-3 top-3 z-10"
              initial="hidden"
              animate={textAnimation}
              variants={{
                hidden: { opacity: 0, visibility: "hidden" },
                visible: { opacity: 1, visibility: "visible" },
              }}
              transition={{ duration: reducedMotion ? 0 : 0.15 }}
            >
              <Button
                type="button"
                variant="ghost"
                aria-label="Close sheet"
                onClick={() => void closeSheet()}
                className="size-11 p-0!"
              >
                <X aria-hidden="true" size={24} />
              </Button>
            </m.div>
            {!horizontal && (
              <div
                aria-hidden="true"
                data-slot="sheet-handle"
                className="mx-auto mb-6 h-1 w-10 bg-muted-foreground/40"
              />
            )}
            <m.div
              initial="hidden"
              animate={textAnimation}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.18 } },
              }}
            >
              <m.div
                className="flex items-start justify-between gap-4 pr-12"
                variants={textVariants}
                transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
              >
                <h2 id={`${id}-title`} className={"typography-section-title"}>
                  {title}
                </h2>
              </m.div>
              <m.p
                variants={textVariants}
                transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
                id={`${id}-description`}
                className={`mt-3 typography-body`}
              >
                {description}
              </m.p>
              {children && (
                <m.div
                  className="mt-6"
                  variants={textVariants}
                  transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
                >
                  {children}
                </m.div>
              )}
            </m.div>
          </Card>
        </m.dialog>
      </div>
    </LazyMotion>
  );
});
