import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import * as motion from 'motion/react-client';
import { SpotlightReveal } from "@/registry/components/spotlight-reveal";
import { Button } from "@/registry/components/button";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { siteDescription, siteUrl } from "@/lib/seo";
import { typography } from "@/registry/lib/typography.shared";

export default function Page() {
  return (
    <div className="isolate flex min-h-dvh w-full min-w-0 flex-col">
    <main className="relative z-10 flex min-h-dvh flex-1 flex-col bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Hangry UI",
          url: siteUrl,
          description: siteDescription,
          inLanguage: "en-GB",
        }}
      />
        <Container className="max-w-7xl flex-1 items-center justify-center py-20 sm:py-24">
          <motion.div
                className="motion-reduce:opacity-100! motion-reduce:transform-none! w-full max-w-6xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              >
          <SpotlightReveal
            variant="default"
            alt="Hangry UI"
            className="aspect-1337/336 h-auto w-full max-w-6xl mask-[linear-gradient(to_bottom,black_35%,transparent_100%)]"
          />
          </motion.div>
          <div className="relative -mt-4 flex w-full flex-col items-start text-left sm:-mt-8 lg:-mt-12">
              <motion.div
                className="motion-reduce:opacity-100! motion-reduce:transform-none! "
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground  md:text-6xl">
                Interfaces that move,
                Details that delight.
              </h1>
              </motion.div>
              <motion.div
                className="motion-reduce:opacity-100! motion-reduce:transform-none! "
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
              <p className={`mt-7 max-w-xl text-balance ${typography.body}`}>
                React components, blocks, and shaders crafted with Motion.
                Build expressive interfaces with details worth slowing down for.
              </p>
              </motion.div>
              <motion.div
                className="motion-reduce:opacity-100! motion-reduce:transform-none! mt-10 flex flex-col items-start gap-4 sm:flex-row sm:gap-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button
                  href="/components"
                  variant="primary"
                >
                  Explore components
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
                <Button
                  href="https://github.com/ascx-studio/ui"
                  variant="outline"
                >
                  Star on GitHub
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Button>
              </motion.div>
          </div>
        </Container>
    </main>
    <Footer />
    </div>
  );
}
