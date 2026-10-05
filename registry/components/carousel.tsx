"use client";

import { useId, useState, type ReactNode } from "react";

interface CarouselProps {
  slides?: ReactNode[];
  label?: string;
  className?: string;
}

export function Carousel({ slides = ["A fresh perspective.", "Space to explore.", "Something worth making."], label = "Featured collection", className = "" }: CarouselProps = {}) {
  const [position, setPosition] = useState(0);
  const id = useId();
  if (!slides.length) return null;
  const index = position % slides.length;
  function move(step: number) { setPosition((index + step + slides.length) % slides.length); }
  return <section aria-roledescription="carousel" aria-label={label} className={`w-full max-w-xl ${className}`}>
    <div id={id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`} className="flex min-h-64 items-center justify-center border border-border bg-gradient-to-br from-emerald-400/15 to-neutral-900 p-8 text-center text-2xl font-medium text-white">{slides[index]}</div>
    <div className="mt-4 flex items-center justify-between gap-4">
      <button type="button" aria-label="Previous slide" aria-controls={id} disabled={slides.length < 2} onClick={() => move(-1)} className="min-h-11 border border-border px-4 text-sm text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-emerald-400 disabled:opacity-40">← Previous</button>
      <p aria-live="polite" aria-atomic="true" className="text-sm text-neutral-400">{index + 1} / {slides.length}</p>
      <button type="button" aria-label="Next slide" aria-controls={id} disabled={slides.length < 2} onClick={() => move(1)} className="min-h-11 border border-border px-4 text-sm text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-emerald-400 disabled:opacity-40">Next →</button>
    </div>
  </section>;
}
