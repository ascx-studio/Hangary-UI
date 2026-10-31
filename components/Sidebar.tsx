"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, PanelLeft, PanelLeftClose } from "lucide-react";
import { useSyncExternalStore } from "react";
import { AnimatePresence, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { NavLine } from "@/hangry/components/nav-line";
import sidebarData from "@/data/sidebar.json";
import { browseSection } from "@/data/Navlinks";
import type { RegistryCategory } from "@/lib/registry";
import ThemeToggle from "@/components/theme-toggle";
import Logo from "@/components/ui/Logo";
import { Outline } from "@/hangry/components/outline";
import { OutlineTrail } from "@/hangry/components/outline-trail";
import {
  getSidebarOpen,
  getServerSidebarOpen,
  setSidebarOpen,
  subscribeSidebarOpen,
} from "@/lib/sidebar-state";

const loadFeatures = () => import("./ui/sidebar-motion-features").then((module) => module.default);

function Navigation({
  category,
  collapsed = false,
}: Readonly<{ category: RegistryCategory; collapsed?: boolean }>) {
  const pathname = usePathname();
  const categoryConfig = sidebarData.categories[category as keyof typeof sidebarData.categories];
  const toLinks = (entries: { label: string; slug: string; description?: string }[]) =>
    entries.map(({ label, slug, description }) => ({
      label,
      description,
      href: `/${category}/${slug}`,
    }));
  const entries: { label: string; slug: string; description?: string; group?: string }[] =
    categoryConfig?.items ?? [];
  const groupTitles = [
    ...new Set(entries.flatMap((item) => (item.group ? [item.group] : []))),
  ].sort((a, b) => a.localeCompare(b));
  const sections = categoryConfig?.items.length
    ? [
        {
          title: categoryConfig.title,
          links: toLinks(collapsed ? entries : entries.filter((item) => !item.group)).sort((a, b) =>
            a.label.localeCompare(b.label),
          ),
        },
      ]
    : [
        {
          title: browseSection.sidebarLabel,
          links: browseSection.links
            .map(({ label, href, description }) => ({ label, href, description }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
      ];
  sections.push({
    title: "Other",
    links: browseSection.links
      .map(({ label, href, description }) => ({ label, href, description }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  });

  if (collapsed) {
    return (
      <div aria-label="Documentation navigation" className="flex min-h-0 flex-1 flex-col gap-6">
        {sections.map((section) => {
          const active =
            section.links.find((link) => pathname === link.href) ??
            section.links.find(
              (link) => section.title === "Other" && pathname.startsWith(`${link.href}/`),
            );
          return (
            <div
              key={section.title}
              className={
                section.title === "Other"
                  ? "relative mt-auto shrink-0 border-t border-sidebar-border pt-4"
                  : "absolute left-0 top-1/2 -translate-y-1/2"
              }
              style={{ height: section.links.length * 18 + (section.title === "Other" ? 16 : 0) }}
            >
              <NavLine
                variant="contained"
                size="sm"
                items={section.links.map((link) => ({
                  id: link.href,
                  label: link.label,
                  href: link.href,
                  card: { title: link.label, description: link.description },
                }))}
                activeId={active?.href ?? ""}
                className="pointer-events-auto gap-4!"
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      {sections.map((section) => {
        const links = section.links.map((link) => ({
          id: link.href,
          label: link.label,
          href: link.href,
        }));
        if (section.title === "Other") {
          const active = section.links.some(
            (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
          );
          return (
            <details
              key={section.title}
              open={active}
              className="group/other mt-auto shrink-0 border-t border-sidebar-border pt-4"
            >
              <summary className="mb-3 flex cursor-pointer list-none items-center justify-between typography-label text-muted-foreground/80 pl-2 [&::-webkit-details-marker]:hidden">
                Other
                <ChevronDown size={16} aria-hidden="true" className="group-open/other:rotate-180" />
              </summary>
              <Outline
                title="Other"
                variant="sidebar"
                items={links}
                className="w-full pl-2 [&>h2]:hidden"
              />
            </details>
          );
        }
        return (
          <div
            key={section.title}
            className="min-h-0 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {links.length > 0 && groupTitles.length === 0 && (
              <Outline
                title={section.title}
                variant="sidebar"
                items={links}
                className="w-full pl-2"
              />
            )}
            {section.title === categoryConfig?.title && groupTitles.length > 0 && (
              <OutlineTrail
                title={section.title}
                items={[
                  ...links,
                  ...groupTitles.flatMap((title) => {
                    const groupLinks = toLinks(entries.filter((item) => item.group === title)).sort(
                      (a, b) => a.label.localeCompare(b.label),
                    );
                    return [
                      { id: `group-${title}`, label: title },
                      ...groupLinks.map((link) => ({
                        id: link.href,
                        label: link.label,
                        href: link.href,
                        indent: true,
                      })),
                    ];
                  }),
                ]}
                className="w-full pl-2 [&>h2]:hidden"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Sidebar({
  category,
  className = "",
}: Readonly<{ category: RegistryCategory; className?: string }>) {
  const desktopOpen = useSyncExternalStore(
    subscribeSidebarOpen,
    getSidebarOpen,
    getServerSidebarOpen,
  );
  const reducedMotion = useReducedMotion();
  const categoryConfig = sidebarData.categories[category as keyof typeof sidebarData.categories];
  const currentPage = categoryConfig?.title ?? "Library";
  return (
    <LazyMotion features={loadFeatures} strict>
      <AnimatePresence initial={false} mode="wait">
        {desktopOpen ? (
          <m.aside
            key="expanded"
            layout
            layoutRoot
            initial={false}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
            className={`sticky top-0 hidden h-dvh w-70 shrink-0 flex-col overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden sidebar-surface [--surface-color:var(--muted)] dark:[--surface-color:#131313] px-4 py-6 text-sidebar-foreground md:flex ${className}`}
          >
            <m.div
              initial={reducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.18 }}
              className="mb-6 flex shrink-0 items-center gap-2"
            >
              <nav aria-label="Breadcrumb" className="min-w-0 flex-1 overflow-hidden">
                <ol className="flex min-w-0 flex-nowrap items-center gap-1.5 whitespace-nowrap text-xs">
                  <li className="shrink-0">
                    <Link href="/" aria-label="Hangry UI home">
                      <Logo variant="wordmark" className="w-18" />
                    </Link>
                  </li>
                  <li aria-hidden="true" className="shrink-0 text-muted-foreground">
                    /
                  </li>
                  <li className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
                    <Link
                      href={`/${category}`}
                      aria-label={`Go to ${currentPage}`}
                      className="block truncate text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {currentPage}
                    </Link>
                  </li>
                </ol>
              </nav>
              <div className="flex shrink-0 items-center gap-1">
                <ThemeToggle />
                <m.button
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                  title="Close sidebar"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring motion-reduce:transition-none"
                >
                  <PanelLeftClose size={22} aria-hidden="true" />
                </m.button>
              </div>
            </m.div>
            <Navigation category={category} />
          </m.aside>
        ) : (
          <m.aside
            key="collapsed"
            layout
            layoutRoot
            aria-label="Collapsed sidebar"
            className="sticky top-0 z-40 hidden h-dvh w-16 shrink-0 md:flex"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-16 min-h-0 flex-col gap-2 px-0 py-6">
              <m.button
                type="button"
                whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                title="Open sidebar"
                className="pointer-events-auto ml-3 group/toggle relative inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="scale-100 opacity-100 transition-[opacity,transform] duration-200 ease-out group-hover/toggle:scale-90 group-hover/toggle:opacity-0 group-focus-visible/toggle:scale-90 group-focus-visible/toggle:opacity-0 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <Logo variant="logo" className="size-8" />
                </span>
                <PanelLeft
                  size={20}
                  aria-hidden="true"
                  className="absolute scale-90 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover/toggle:scale-100 group-hover/toggle:opacity-100 group-focus-visible/toggle:scale-100 group-focus-visible/toggle:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </m.button>
              <Navigation category={category} collapsed />
            </div>
          </m.aside>
        )}
      </AnimatePresence>
      <details className="group sidebar-surface [--surface-color:var(--muted)] text-sidebar-foreground dark:[--surface-color:#131313] md:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4 focus-visible:outline-2 focus-visible:outline-sidebar-ring [&::-webkit-details-marker]:hidden">
          <PanelLeft size={20} aria-hidden="true" />
          <span className="flex-1 text-sm font-semibold">Library navigation</span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <div
          className="max-h-[75dvh] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden px-4 pb-6"
          onClick={(event) => {
            if (!(event.target instanceof Element) || !event.target.closest("a")) return;
            const disclosure = event.currentTarget.closest("details");
            disclosure?.removeAttribute("open");
            disclosure?.querySelector("summary")?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            const disclosure = event.currentTarget.closest("details");
            disclosure?.removeAttribute("open");
            disclosure?.querySelector("summary")?.focus();
          }}
        >
          <div className="mb-4 flex justify-end">
            <ThemeToggle />
          </div>
          <Navigation category={category} />
        </div>
      </details>
    </LazyMotion>
  );
}
