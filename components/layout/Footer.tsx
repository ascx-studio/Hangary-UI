"use client";

import { memo, useRef } from "react";
import { useInView } from "motion/react";
import * as motion from 'motion/react-client';
import Link from "next/link";
import { Heart } from "lucide-react";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import Logo from "@/components/ui/Logo";
import { browseSection } from "@/data/Navlinks";
import { typography } from "@/registry/lib/typography.shared";
import { SpotlightReveal } from "@/registry/components/spotlight-reveal";
import { siteUrl } from "@/lib/seo";

const linkClass = "rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";
const repository = "https://github.com/ascx-studio/ui";
const xProfile = "https://x.com/razeevascx";
const askPrompt = encodeURIComponent(
  `Using ${siteUrl}, explain why I should use Hangry UI to build web interfaces. Cover its React components, blocks, shaders, animations, installation workflow, and what makes it stand out. Explain what the examples and source code reveal about its design and development approach. Base your answer on the website, cite relevant pages, and distinguish documented features from inference.`,
);
const groups = [
  { title: "Pages", links: [{ label: "Home", href: "/" }, ...browseSection.links] },
  {
    title: "Ask AI",
    links: [
      { label: "Gemini", href: `https://www.google.com/search?udm=50&q=${askPrompt}` },
      { label: "Claude", href: `https://claude.ai/new?q=${askPrompt}` },
      { label: "ChatGPT", href: `https://chatgpt.com/?q=${askPrompt}` },
      { label: "Perplexity", href: `https://www.perplexity.ai/search?q=${askPrompt}` },
      { label: "Grok", href: `https://grok.com/?q=${askPrompt}` },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "X", href: xProfile },
      { label: "GitHub", href: repository },
      { label: "Sponsor", href: "/sponser" },
      { label: "Support the project", href: "https://github.com/sponsors/razeevascx" },
    ],
  },
];

const Footer = memo(function Footer() {
  const entranceRef = useRef<HTMLDivElement>(null);
  const reachedFooter = useInView(entranceRef, { once: true, margin: "0px 0px -40px 0px" });

  return (
    <>
    <div ref={entranceRef} aria-hidden="true" className="pointer-events-none -mb-px h-px w-full shrink-0" />
    <footer className="bottom-0 z-0 w-full shrink-0 overflow-hidden border-t border-border/50 bg-background md:sticky">
      <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-10 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pb-14 sm:grid-cols-3 md:gap-x-10 md:pb-20 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <motion.div
            className="col-span-2 space-y-5 motion-reduce:opacity-100! motion-reduce:transform-none! sm:col-span-3 lg:col-span-1"
            initial={{ opacity: 0, y: 16 }}
            animate={reachedFooter ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/" aria-label="Hangry UI home" className={`${linkClass} inline-block`}>
              <Logo variant="wordmark" className="w-40" />
            </Link>
            <p className={typography.caption}>© 2026 Hangry UI.</p>
          </motion.div>
          {groups.map(({ title, links }, index) => (
            <motion.nav
              key={title}
              aria-label={`Footer ${title.toLowerCase()}`}
              className="motion-reduce:opacity-100! motion-reduce:transform-none!"
              initial={{ opacity: 0, y: 16 }}
              animate={reachedFooter ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className={typography.sectionTitle}>{title}</h2>
              <ul className="mt-6 space-y-5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className={`${linkClass} inline-flex items-center gap-1.5 text-base`}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>
        <motion.div
          className="flex flex-col gap-6 border-t border-border/50 py-7 motion-reduce:opacity-100! motion-reduce:transform-none! sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={reachedFooter ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-6">
            <a href={xProfile} aria-label="@razeevascx on X" className={`${linkClass} inline-flex size-6 items-center justify-center text-2xl`}>
              <span aria-hidden="true">𝕏</span>
            </a>
            <a href={repository} aria-label="Hangry UI on GitHub" className={linkClass}>
              <GitHubDark className="size-6" aria-hidden="true" />
            </a>
            <Link href="/sponser" aria-label="Sponsor Hangry UI" className={linkClass}>
              <Heart size={23} aria-hidden="true" />
            </Link>
          </div>
          <p className={typography.caption}>
            Built by <a href={xProfile} className={linkClass}>@razeevascx</a>
          </p>
          <nav aria-label="Footer quick links" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {browseSection.links.map(({ label, href }) => (
              <Link key={href} href={href} className={linkClass}>{label}</Link>
            ))}
          </nav>
        </motion.div>
        <motion.div
          className="motion-reduce:opacity-100! motion-reduce:transform-none!"
          initial={{ opacity: 0, y: 20 }}
          animate={reachedFooter ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
        <SpotlightReveal
          variant="stroke"
          alt=""
          strokeSrc="/footerart.svg"
          className="mt-6 aspect-1062/224 h-auto w-full translate-y-[8%] sm:mt-10"
        />
        </motion.div>
      </div>
    </footer>
    </>
  );
});

export default Footer;
