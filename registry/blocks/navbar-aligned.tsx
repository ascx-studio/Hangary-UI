"use client";

import { memo, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Heart, Menu, X } from "lucide-react";
import { cn } from "cn";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import { samplePageLinks } from "../lib/navigation.shared";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";
import { Banner } from "../components/banner";
import { Button } from "../components/button";

interface NavbarProps extends ComponentProps<"header"> {
  brand?: string;
  logo?: ReactNode;
  homeHref?: string;
  links?: {
    label: string;
    href: string;
  }[];
  activeHref?: string;
  announcement?: string;
  badge?: string;
  supportHref?: string;
  githubHref?: string;
  account?: {
    name: string;
    src?: string;
    href: string;
  };
}

export const NavbarAligned = memo(function NavbarAligned({
  brand = "Hangry UI",
  logo,
  homeHref = "#home",
  links = samplePageLinks,
  activeHref,
  announcement,
  badge = "",
  supportHref = "#sponsor",
  githubHref = "#github",
  account,
  className,
  children,
  ...props
}: NavbarProps = {}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  function closeMenu() {
    setOpen(false);
    toggle.current?.focus();
  }
  return (
    <header
      {...props}
      data-slot="navbar"
      data-layout="aligned"
      className={cn(
        "@container w-full text-foreground",
        "border border-border bg-background",
        className,
      )}
    >
      {announcement && (
        <Banner
          message={announcement}
          dismissible={false}
          className="border-0 border-b border-border"
        />
      )}
      <div
        className={cn(
          "grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4",
          "@4xl:grid-cols-[auto_1fr_auto]",
        )}
      >
        <a
          href={homeHref}
          className="flex w-fit items-center gap-2 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-ring"
        >
          {logo}
          <span>{brand}</span>
          {badge && <Badge variant="neutral">{badge}</Badge>}
        </a>
        <nav
          aria-label="Primary navigation"
          className={cn("hidden items-center gap-6 @4xl:flex", "justify-start pl-4")}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeHref === link.href ? "page" : undefined}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          {supportHref && (
            <a
              href={supportHref}
              aria-label="Support the project"
              className="inline-flex size-9 items-center justify-center hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Heart size={18} aria-hidden="true" />
            </a>
          )}
          {githubHref && (
            <a
              href={githubHref}
              aria-label="GitHub repository"
              className="inline-flex size-9 items-center justify-center hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              <GitHubDark className="invert dark:invert-0" width={18} height={18} aria-hidden="true" />
            </a>
          )}
          {account && (
            <a
              href={account.href}
              aria-label={`${account.name}'s account`}
              className="focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Avatar name={account.name} src={account.src} size={32} />
            </a>
          )}
          <Button
            ref={toggle}
            variant="ghost"
            className="min-h-9 px-2 @4xl:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </Button>
        </div>
      </div>
      <nav
        id={menuId}
        aria-label="Mobile navigation"
        hidden={!open}
        className="border-t border-border px-5 py-3 @4xl:hidden"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
          }
        }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={activeHref === link.href ? "page" : undefined}
            onClick={() => setOpen(false)}
            className="block px-2 py-3 text-sm text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
      {children}
    </header>
  );
});
