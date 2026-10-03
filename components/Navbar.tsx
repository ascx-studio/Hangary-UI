"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import Logo from "@/components/ui/Logo";
import { browseSection } from "@/data/Navlinks";

export default function Navbar() {
  const pathname = usePathname();

  if (/^\/components\/[^/]+\/?$/.test(pathname) || /^\/(blocks|shader|utils)(\/|$)/.test(pathname)) return null;

  const iconLinkClass = "inline-flex size-10 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";

  return (
    <header className="sticky top-0 z-40 w-dvw overflow-x-clip  px-2 py-2 backdrop-blur  sm:px-3 sm:py-3">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 border border-border bg-card/90 p-2 shadow-sm sm:p-3 lg:grid lg:min-h-16 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-x-6 lg:gap-y-0">
        <div className="flex w-full min-w-0 items-center justify-between gap-3 lg:contents">
          <Link href="/" aria-label="Hangry UI home" className="min-w-0 shrink-0 focus-visible:outline-2 focus-visible:outline-ring lg:col-start-1">
            <Logo variant="wordmark" className="h-auto w-36 sm:w-40" />
          </Link>
          <div className="flex shrink-0 items-center justify-end gap-2 lg:col-start-3 lg:row-start-1">
            <Link href="/sponser" aria-label="Support" title="Support" className={iconLinkClass}>
              <Heart size={19} aria-hidden="true" />
            </Link>
            <a href="https://github.com/razeevascx/lazy-ui" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub" className={iconLinkClass}>
              <GitHubDark className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <nav aria-label="Main navigation" className="min-w-0 text-sm lg:col-start-2 lg:row-start-1">
          <div className="flex flex-wrap items-center justify-center gap-1">
            {browseSection.links.map(link => (
              <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className="whitespace-nowrap border border-transparent px-3 py-2 font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:border-primary/50 aria-[current=page]:bg-background aria-[current=page]:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
