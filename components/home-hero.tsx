"use client";

import { useState } from "react";
import * as motion from "motion/react-client";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ReactDark, Nextjs, TailwindCSS, MotionDark } from "@ridemountainpig/svgl-react";
import { Button } from "@/registry/components/button";
import { LogoAnimation } from "@/registry/components/logo-animation";
import Logo from "@/components/ui/Logo";
import Container from "@/components/layout/Container";

export default function HomeHero() {
  const [logoFinished, setLogoFinished] = useState(false);

  return (
    <Container className="max-w-7xl flex-1 items-center justify-center py-20 sm:py-24">
      <LogoAnimation
        width={1337}
        height={336}
        alt="Hangry UI"
        className="aspect-[1337/336] h-auto! w-full! max-w-6xl"
        logo={
          <Logo
            variant="wordmark"
            className="h-full w-full object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        }
        onAnimationComplete={() => setLogoFinished(true)}
      />
      <motion.div
        className="motion-reduce:opacity-100! motion-reduce:transform-none! relative mt-10 w-full text-left sm:mt-12"
        initial={{ opacity: 0, y: 12 }}
        animate={logoFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          Interfaces that move, Details that delight.
        </h1>
        <p className={`mt-7 max-w-xl text-balance typography-body`}>
          React components, blocks, and shaders crafted with Motion. Build expressive interfaces
          with details worth slowing down for.
        </p>
        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
          <Button href="/components" variant="primary">
            Explore components
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button href="https://github.com/ascx-studio/ui" variant="outline">
            Star on GitHub
            <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-sm">
          <span className="text-muted-foreground">Built with</span>
          <span className="inline-flex items-center gap-2">
            <ReactDark className="size-4" aria-hidden="true" />
            React
          </span>
          <span className="inline-flex items-center gap-2">
            <Nextjs className="size-4" aria-hidden="true" />
            Next.js
          </span>
          <span className="inline-flex items-center gap-2">
            <TailwindCSS className="size-4" aria-hidden="true" />
            Tailwind CSS
          </span>
          <span className="inline-flex items-center gap-2">
            <MotionDark className="size-4" aria-hidden="true" />
            Motion
          </span>
        </div>
      </motion.div>
    </Container>
  );
}
