"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { browseSection } from "@/data/Navlinks";

export default function Navbar() {
  const pathname = usePathname();

  if (/^\/components\/[^/]+\/?$/.test(pathname) || /^\/(blocks|shader)(\/|$)/.test(pathname)) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 sm:flex-nowrap">
        <Link href="/" aria-label="Hangry UI home" className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-ring">
          <Logo variant="wordmark" className="h-auto w-32" />
        </Link>
        <nav aria-label="Main navigation" className="flex flex-1 items-center gap-1 overflow-x-auto text-sm sm:justify-end">
          {browseSection.links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/sponser" className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          Support
        </Link>
      </div>
    </header>
  );
}
