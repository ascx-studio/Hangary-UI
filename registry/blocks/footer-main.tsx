import { memo, type ComponentProps } from "react";
import { cn } from "cn";

import * as motion from "motion/react-client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import Image from "next/image";
import { SpotlightReveal } from "../components/spotlight-reveal";
import { sampleMainFooterGroups, samplePageLinks } from "../lib/navigation.shared";

type FooterLink = { label: string; href: string };
interface FooterMainProps extends Omit<ComponentProps<"footer">, "children"> {
  homeHref?: string;
  githubHref?: string;
  xHref?: string;
  sponsorHref?: string;
  groups?: readonly { title: string; links: readonly FooterLink[] }[];
  quickLinks?: readonly FooterLink[];
  logoSrc?: string;
  artSrc?: string;
  copyright?: string;
}

const linkClass =
  "rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";
export const FooterMain = memo(function FooterMain({
  groups = sampleMainFooterGroups,
  homeHref = "#home",
  githubHref = "#github",
  xHref = "#x",
  sponsorHref = "#sponsor",
  quickLinks = samplePageLinks,
  logoSrc = "/wordmark.svg",
  artSrc = "/footerart.svg",
  copyright = "© 2026 Hangry UI.",
  className,
  ...props
}: FooterMainProps = {}) {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none -mb-px h-px w-full shrink-0" />
      <footer
        data-slot="footer-main"
        {...props}
        className={cn(
          "bottom-0 z-0 w-full shrink-0 overflow-hidden border-t border-border/50 bg-background",
          className,
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-10 md:pt-20">
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 pb-14 sm:grid-cols-3 md:gap-x-10 md:pb-20 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
            <motion.div
              className="col-span-2 space-y-5 motion-reduce:opacity-100! motion-reduce:transform-none! sm:col-span-3 lg:col-span-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={homeHref}
                aria-label="Hangry UI home"
                className={`${linkClass} inline-block`}
              >
                <Image
                  src={logoSrc}
                  alt="Hangry UI"
                  width={160}
                  height={40}
                  className="h-auto w-40"
                />
              </Link>
              <p className={"typography-caption"}>{copyright}</p>
            </motion.div>
            {groups.map(({ title, links }, index) => (
              <motion.nav
                key={title}
                aria-label={`Footer ${title.toLowerCase()}`}
                className="motion-reduce:opacity-100! motion-reduce:transform-none!"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className={"typography-section-title"}>{title}</h2>
                <ul className="mt-6 space-y-5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className={`${linkClass} inline-flex items-center gap-1.5 text-base`}
                      >
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-6">
              <a
                href={xHref}
                aria-label="@razeevascx on X"
                className={`${linkClass} inline-flex size-6 items-center justify-center text-2xl`}
              >
                <span aria-hidden="true">𝕏</span>
              </a>
              <a href={githubHref} aria-label="Hangry UI on GitHub" className={linkClass}>
                <GitHubDark className="size-6" aria-hidden="true" />
              </a>
              <Link href={sponsorHref} aria-label="Sponsor Hangry UI" className={linkClass}>
                <Heart size={23} aria-hidden="true" />
              </Link>
            </div>
            <p className={"typography-caption"}>
              Built by{" "}
              <a href={xHref} className={linkClass}>
                @razeevascx
              </a>
            </p>
            <nav aria-label="Footer quick links" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {quickLinks.map(({ label, href }) => (
                <Link key={href} href={href} className={linkClass}>
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
          <motion.div
            className="motion-reduce:opacity-100! motion-reduce:transform-none!"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SpotlightReveal
              variant="stroke"
              alt=""
              strokeSrc={artSrc}
              className="mt-6 aspect-1062/224 h-auto w-full translate-y-[8%] sm:mt-10"
            />
          </motion.div>
        </div>
      </footer>
    </>
  );
});
