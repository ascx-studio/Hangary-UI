import Footer from "@/components/layout/Footer";
import * as motion from "motion/react-client";
import { SpotlightReveal } from "@/registry/components/spotlight-reveal";
import Container from "@/components/layout/Container";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import type { ResolvingMetadata } from "next";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata(
    "/sponser",
    "Sponsor Hangry UI",
    "Support free React components, documentation, and ongoing maintenance. Sponsor Hangry UI on GitHub or contribute to the collection.",
    await parent,
  );
}

const faqs = [
  {
    question: "Do I need to pay to use Hangry UI?",
    answer: "No. The library is free to use, and supporting the project is optional.",
  },
  {
    question: "Can I contribute without writing code?",
    answer:
      "Yes. Sharing the library, reporting bugs, improving documentation, and suggesting examples are all useful ways to help.",
  },
  {
    question: "How do I report a bug or request a component?",
    answer:
      "Open an issue in the GitHub repository. For bugs, include steps to reproduce the problem and your framework and browser versions. For component requests, describe what you want to build.",
  },
  {
    question: "Where should I start with a code contribution?",
    answer:
      "Check the existing issues for something you can help with. For larger changes, open an issue first to discuss the approach before starting work.",
  },
] as const;

export default function SponsorPage() {
  return (
    <div className="isolate flex min-h-dvh w-full min-w-0 flex-col">
      <div className="relative z-10 min-h-dvh bg-background text-foreground">
        <main>
          <Container className="px-6 py-20 md:px-10 md:py-28">
            <motion.div
              className="motion-reduce:opacity-100! motion-reduce:transform-none! mx-auto w-full max-w-6xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/"
                aria-label="Hangry UI home"
                className="mx-auto block w-full max-w-6xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <SpotlightReveal
                  src="/wordmark.svg"
                  alt="Hangry UI"
                  className="aspect-1337/336 h-auto w-full mask-[linear-gradient(to_bottom,black_35%,transparent_100%)]"
                />
              </Link>
            </motion.div>
            <div className="max-w-3xl">
              <motion.div
                className="motion-reduce:opacity-100! motion-reduce:transform-none! "
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                  Good tools grow through generous people.
                </h1>
              </motion.div>
              <motion.div
                className="motion-reduce:opacity-100! motion-reduce:transform-none! "
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={`mt-6 max-w-2xl typography-body`}>
                  Hangry UI is open source and free to use. Sponsorship, a star, or a contribution
                  helps keep the collection moving.
                </p>
              </motion.div>
              <motion.div
                className="motion-reduce:opacity-100! motion-reduce:transform-none! "
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={`mt-4 max-w-2xl typography-body`}>
                  Contributions help improve the components, keep examples useful, and catch bugs in
                  real projects. You can start small: tell us what worked, what was confusing, or
                  what you would like to see next.
                </p>
              </motion.div>
              <motion.div
                className="motion-reduce:opacity-100! motion-reduce:transform-none! mt-6 flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href="https://github.com/sponsors/razeevascx"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center bg-emerald-400 px-5 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                >
                  Sponsor on GitHub
                </a>
                <a
                  href="https://github.com/ascx-studio/ui"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center bg-neutral-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                >
                  Star on GitHub
                </a>
              </motion.div>
            </div>

            <section
              aria-labelledby="faq-heading"
              className="mt-12 max-w-3xl border-t border-border pt-10"
            >
              <motion.h2
                id="faq-heading"
                className={`typography-section-title motion-reduce:opacity-100! motion-reduce:transform-none!`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                Frequently asked questions
              </motion.h2>
              <div className="mt-8 divide-y divide-border">
                {faqs.map(({ question, answer }, index) => (
                  <motion.details
                    key={question}
                    className="py-4 motion-reduce:opacity-100! motion-reduce:transform-none!"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <summary className="cursor-pointer font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                      {question}
                    </summary>
                    <p className={`mt-3 typography-body`}>{answer}</p>
                  </motion.details>
                ))}
              </div>
              <p className="mt-8 text-sm text-muted-foreground">
                Have another question?{" "}
                <Link
                  href="https://github.com/ascx-studio/ui/issues"
                  className="text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  Start a conversation on GitHub.
                </Link>
              </p>
            </section>
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  );
}
