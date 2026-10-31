import Link from "next/link";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/theme-toggle";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import * as motion from "motion/react-client";
import { SpotlightReveal } from "@/registry/components/spotlight-reveal";
import { Button, buttonClassName } from "@/registry/components/button";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import {
  ReactDark,
  ReactLight,
  Nextjs,
  TailwindCSS,
  MotionDark,
  MotionLight,
} from "@ridemountainpig/svgl-react";
import JsonLd from "@/components/seo/JsonLd";
import { siteDescription, siteUrl } from "@/lib/seo";
import { contactEmail } from "@/lib/site-content";

export default function Page() {
  return (
    <div className="isolate flex min-h-dvh w-full min-w-0 flex-col">
      <main className="relative z-10 flex min-h-dvh flex-1 flex-col bg-background">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/"
            aria-label="Hangry UI home"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Logo variant="logo" className="size-10" priority />
          </Link>
          <ThemeToggle />
        </header>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Hangry UI",
            url: siteUrl,
            description: siteDescription,
            inLanguage: "en-GB",
            publisher: { "@id": `${siteUrl}/#project` },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": `${siteUrl}/#software`,
            name: "Hangry UI",
            url: siteUrl,
            description: siteDescription,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Cross-platform",
            softwareRequirements: "React, Tailwind CSS; Motion for animated components",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            author: {
              "@type": "Person",
              name: "Rajeev Puri",
              url: "https://razeev.com",
              sameAs: ["https://github.com/razeevascx", "https://x.com/razeevascx"],
            },
            publisher: { "@id": `${siteUrl}/#project` },
            sameAs: ["https://github.com/ascx-studio/ui"],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${siteUrl}/#project`,
            name: "Hangry UI",
            url: siteUrl,
            description: "The project maintaining the Hangry UI React component collection.",
            email: contactEmail,
            contactPoint: {
              "@type": "ContactPoint",
              email: contactEmail,
              contactType: "Project support",
              url: `mailto:${contactEmail}`,
            },
            sameAs: ["https://github.com/ascx-studio/ui", "https://x.com/razeevascx"],
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
              className="aspect-1337/336 h-auto w-full max-w-6xl mask-[linear-gradient(to_bottom,black_65%,transparent_100%)] dark:mask-[linear-gradient(to_bottom,black_35%,transparent_100%)]"
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
                Interfaces that move, Details that delight.
              </h1>
            </motion.div>
            <motion.div
              className="motion-reduce:opacity-100! motion-reduce:transform-none! "
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className={`mt-7 max-w-xl text-balance typography-body`}>
                React components, blocks, and shaders crafted with Motion. Build expressive
                interfaces with details worth slowing down for.
              </p>
            </motion.div>
            <motion.div
              className="motion-reduce:opacity-100! motion-reduce:transform-none! mt-10 flex flex-col items-start gap-4 sm:flex-row sm:gap-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/components"
                transitionTypes={["hero-components"]}
                className={buttonClassName()}
              >
                Explore components
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Button href="https://github.com/ascx-studio/ui" variant="outline">
                Star on GitHub
                <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
            </motion.div>
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-sm motion-reduce:opacity-100! motion-reduce:transform-none!"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-muted-foreground">Built with</span>
              <span className="inline-flex items-center gap-2">
                <ReactDark className="hidden size-4 dark:block" aria-hidden="true" />
                <ReactLight className="size-4 dark:hidden" aria-hidden="true" />
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
                <MotionDark className="hidden size-4 dark:block" aria-hidden="true" />
                <MotionLight className="size-4 dark:hidden" aria-hidden="true" />
                Motion
              </span>
            </motion.div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
