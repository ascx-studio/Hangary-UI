"use client";

import { typography } from "../lib/typography.shared";
import { memo, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { LazyMotion, domAnimation, useAnimationControls, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Button } from "./button";
import { Card } from "./card";

interface BottomSheetProps {
  triggerLabel?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const BottomSheet = memo(function BottomSheet({
  triggerLabel = "Open bottom sheet",
  title = "Make yourself at home",
  description = "A little space for your next action. Press Escape or close to return.",
  children,
  className = "",
}: BottomSheetProps = {}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const animation = useAnimationControls();
  const textAnimation = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const closing = useRef(false);

  const textVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 12, transition: { duration: reducedMotion ? 0 : 0.12 } },
    visible: { opacity: 1, y: 0 },
  };

  const openSheet = async () => {
    const sheet = dialog.current;
    if (!sheet || sheet.open) return;
    textAnimation.set("hidden");
    animation.set({ y: 0, opacity: 0, width: "100%", height: "auto" });
    // Motion renders on the next frame; measure the natural size immediately on reopen.
    sheet.style.width = "100%";
    sheet.style.height = "auto";
    sheet.showModal();
    const { width, height } = sheet.getBoundingClientRect();
    sheet.style.overflow = "hidden";
    animation.set({
      width: reducedMotion ? width : Math.min(144, width),
      height: reducedMotion ? height : Math.min(64, height),
      y: reducedMotion ? 0 : "100%",
      opacity: 0,
    });
    await animation.start({
      y: 0,
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
    animation.set({ width: "100%", height: "auto" });
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
    animation.set({ width, height });
    await textAnimation.start("hidden");
    await animation.start({
      width: reducedMotion ? width : Math.min(144, width),
      height: reducedMotion ? height : Math.min(64, height),
      transition: { duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] },
    });
    await animation.start({
      y: reducedMotion ? 0 : "calc(100% + 16px)",
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
        <Button
          type="button"
          aria-haspopup="dialog"
          onClick={() => void openSheet()}
        >
          {triggerLabel}
        </Button>
        <m.dialog
          ref={node => {
            dialog.current = node;
            node?.setAttribute("closedby", "any");
          }}
          initial={{ y: "100%", opacity: 0 }}
          animate={animation}
          onCancel={event => {
            event.preventDefault();
            void closeSheet();
          }}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
          className="fixed inset-x-0 bottom-4 top-auto mx-auto my-0 max-h-[85dvh] w-full max-w-none overflow-y-auto border border-border bg-card p-0 text-card-foreground shadow-xl backdrop:bg-black/60 sm:mx-auto sm:max-w-xl"
        >
          <Card title="" description="" className="relative max-w-none! border-0!">
            <m.div
              className="absolute right-3 top-3 z-10"
              initial="hidden"
              animate={textAnimation}
              variants={{ hidden: { opacity: 0, visibility: "hidden" }, visible: { opacity: 1, visibility: "visible" } }}
              transition={{ duration: reducedMotion ? 0 : 0.15 }}
            >
              <Button
                type="button"
                variant="ghost"
                aria-label="Close bottom sheet"
                onClick={() => void closeSheet()}
                className="size-11 p-0!"
              >
                <X aria-hidden="true" size={24} />
              </Button>
            </m.div>
            <div
              aria-hidden="true"
              className="mx-auto mb-6 h-1 w-10 bg-muted-foreground/40"
            />
            <m.div
              initial="hidden"
              animate={textAnimation}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.18 } } }}
            >
              <m.div className="flex items-start justify-between gap-4 pr-12" variants={textVariants} transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}>
                <h2 id={`${id}-title`} className={typography.sectionTitle}>
                  {title}
                </h2>

              </m.div>
              <m.p
                variants={textVariants}
                transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
                id={`${id}-description`}
                className={`mt-3 ${typography.body}`}
              >
                {description}
              </m.p>
              {children && <m.div className="mt-6" variants={textVariants} transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}>{children}</m.div>}
            </m.div>
          </Card>
        </m.dialog>
      </div>
    </LazyMotion>
  );
});
