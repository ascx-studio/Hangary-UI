"use client";

import {
  Children,
  memo,
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, LazyMotion, domMax, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { Button } from "./button";
import { AspectRatio } from "./aspect-ratio";

interface CarouselProps {
  children?: ReactNode;
  label?: string;
  className?: string;
}

export const Carousel = memo(function Carousel({
  children,
  label = "Featured collection",
  className,
}: CarouselProps = {}) {
  const slides =
    children === undefined
      ? ["A fresh perspective.", "Space to explore.", "Something worth making."]
      : Children.toArray(children);
  const [navigation, setNavigation] = useState({ position: 0, direction: 1 });
  const id = useId();
  const reducedMotion = useReducedMotion();
  const index = navigation.position % slides.length;
  useEffect(() => {
    if (slides.length < 2 || reducedMotion) return;
    const timer = window.setInterval(
      () =>
        setNavigation((previous) => ({
          position: ((previous.position % slides.length) + 1) % slides.length,
          direction: 1,
        })),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [index, slides.length, reducedMotion]);
  if (!slides.length) return null;
  const select = (next: number) =>
    setNavigation((previous) => ({
      position: next,
      direction: next > previous.position % slides.length ? 1 : -1,
    }));
  const move = (step: number) =>
    setNavigation((previous) => ({
      position: ((previous.position % slides.length) + step + slides.length) % slides.length,
      direction: step > 0 ? 1 : -1,
    }));
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select(event.key === "Home" ? 0 : slides.length - 1);
    }
  };

  return (
    <LazyMotion features={domMax} strict>
      <section
        aria-roledescription="carousel"
        aria-label={label}
        className={cn("w-full max-w-sm", className)}
      >
        <AspectRatio
          id={id}
          ratio={9 / 16}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <AnimatePresence initial={false} custom={navigation.direction}>
            <m.div
              key={`${slides.length}-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              className={cn(
                "absolute inset-0 flex touch-pan-y items-center justify-center will-change-transform",
                "typography-section-title",
              )}
              custom={navigation.direction}
              variants={{
                enter: { opacity: 0, scale: reducedMotion ? 1 : 0.98 },
                visible: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: reducedMotion ? 1 : 1.02 },
              }}
              initial="enter"
              animate="visible"
              exit="exit"
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 170, damping: 28, mass: 1 }
              }
              drag={slides.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              dragMomentum={false}
              dragTransition={{ bounceStiffness: 230, bounceDamping: 30 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 40 || Math.abs(info.velocity.x) > 500) {
                  const direction = Math.abs(info.offset.x) > 40 ? info.offset.x : info.velocity.x;
                  move(direction < 0 ? 1 : -1);
                }
              }}
            >
              {slides[index]}
            </m.div>
          </AnimatePresence>
        </AspectRatio>
        <div className="mt-4 flex items-center justify-between gap-3">
          {slides.length > 1 && (
            <div className="flex items-center" aria-label="Choose slide">
              {slides.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  type="button"
                  aria-label={`Go to slide ${slideIndex + 1}`}
                  aria-current={slideIndex === index ? "true" : undefined}
                  aria-controls={id}
                  onClick={() => select(slideIndex)}
                  onKeyDown={onKeyDown}
                  className="flex size-7 items-center justify-center focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <m.span
                    aria-hidden="true"
                    animate={{ width: slideIndex === index ? 20 : 8 }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 250, damping: 30 }
                    }
                    className={cn(
                      "relative h-1 overflow-hidden",
                      slideIndex === index
                        ? "bg-muted-foreground/40"
                        : "bg-muted-foreground/40 hover:bg-muted-foreground",
                    )}
                  >
                    {slideIndex === index && (
                      <m.span
                        key={index}
                        className="absolute inset-0 origin-left bg-foreground"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={
                          reducedMotion ? { duration: 0 } : { duration: 4, ease: "linear" }
                        }
                      />
                    )}
                  </m.span>
                </button>
              ))}
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              aria-label="Previous slide"
              aria-controls={id}
              disabled={slides.length < 2}
              onClick={() => move(-1)}
              onKeyDown={onKeyDown}
              className="size-11 shrink-0 p-0!"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              aria-label="Next slide"
              aria-controls={id}
              disabled={slides.length < 2}
              onClick={() => move(1)}
              onKeyDown={onKeyDown}
              className="size-11 shrink-0 p-0!"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          Slide {index + 1} of {slides.length}
        </p>
      </section>
    </LazyMotion>
  );
});
