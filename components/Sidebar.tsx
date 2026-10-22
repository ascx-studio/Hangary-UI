'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Heart, PanelLeft, PanelLeftClose } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { AnimatePresence, LazyMotion, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { NavLine } from '@/registry/components/nav-line'
import { GitHubDark } from '@ridemountainpig/svgl-react'
import sidebarData from '@/data/sidebar.json'
import { browseSection } from '@/data/Navlinks'
import type { RegistryCategory } from '@/lib/registry'
import Logo from '@/components/ui/Logo'
import { Outline } from '@/registry/components/outline'
import { getSidebarOpen, getServerSidebarOpen, setSidebarOpen, subscribeSidebarOpen } from '@/lib/sidebar-state'

const loadFeatures = () => import('./ui/sidebar-motion-features').then(module => module.default)

function Navigation({ category, collapsed = false }: Readonly<{ category: RegistryCategory; collapsed?: boolean }>) {
  const pathname = usePathname()
  const categoryConfig = sidebarData.categories[category as keyof typeof sidebarData.categories]
  const toLinks = (entries: { label: string; slug: string; description?: string }[]) =>
    entries.map(({ label, slug, description }) => ({ label, description, href: `/${category}/${slug}` }))
  const entries: { label: string; slug: string; description?: string; group?: string }[] = categoryConfig?.items ?? []
  const groupTitles = [...new Set(entries.map(item => item.group ?? categoryConfig?.title))]
  const sections = categoryConfig?.items.length
    ? groupTitles.map(title => ({ title, links: toLinks(entries.filter(item => (item.group ?? categoryConfig.title) === title)) }))
    : [{ title: browseSection.sidebarLabel, links: browseSection.links.map(({ label, href, description }) => ({ label, href, description })) }]
  sections.push({ title: 'Other', links: browseSection.links.map(({ label, href, description }) => ({ label, href, description })) })

  if (collapsed) {
    return <div aria-label="Documentation navigation" className="flex min-h-0 flex-1 flex-col gap-6">
      {sections.map(section => {
        const active = section.links.find(link => pathname === link.href)
          ?? section.links.find(link => section.title === 'Other' && pathname.startsWith(`${link.href}/`))
        return <div key={section.title}
          className={section.title === 'Other' ? 'relative mt-auto shrink-0 border-t border-sidebar-border pt-4' : 'absolute left-0 top-1/2 -translate-y-1/2'}
          style={{ height: section.links.length * 18 + (section.title === 'Other' ? 16 : 0) }}>
          <NavLine
            variant="contained"
            size="sm"
            items={section.links.map(link => ({ id: link.href, label: link.label, href: link.href, card: { title: link.label, description: link.description } }))}
            activeId={active?.href ?? ""}
            className="pointer-events-auto gap-4!"
          />
        </div>
      })}
    </div>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      {sections.map(section => (
        <div key={section.title} className={section.title === 'Other' ? 'mt-auto shrink-0 border-t border-sidebar-border pt-4' : 'min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'}>
          <Outline
            title={section.title}
            variant="sidebar"
            items={section.links.map(link => ({ id: link.href, label: link.label, href: link.href }))}
            className="w-full"
          />
        </div>
      ))}
    </div>
  )
}

function SidebarFooter() {
  const linkClass = "inline-flex items-center gap-2 rounded-sm py-2 text-sm text-muted-foreground hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
  return (
    <nav aria-label="Sponser and community" className="flex shrink-0 items-center justify-center gap-3 pt-8">
      <Link href="/sponser" className={linkClass}><Heart size={16} aria-hidden="true" />Sponser</Link>
      <span aria-hidden="true" className="text-muted-foreground">|</span>
      <a href="https://github.com/ascx-studio/ui" target="_blank" rel="noreferrer" className={linkClass}><GitHubDark className="size-4" aria-hidden="true" />GitHub</a>
    </nav>
  )
}

export default function Sidebar({ category, className = "" }: Readonly<{ category: RegistryCategory; className?: string }>) {
  const desktopOpen = useSyncExternalStore(subscribeSidebarOpen, getSidebarOpen, getServerSidebarOpen)
  const reducedMotion = useReducedMotion()
  return (
    <LazyMotion features={loadFeatures} strict>
      <AnimatePresence initial={false} mode="wait">
      {desktopOpen ? (
        <m.aside key="expanded" layout layoutRoot initial={false} animate={{ opacity: 1 }} exit={reducedMotion ? undefined : { opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }} className={`sticky top-0 hidden h-dvh w-70 shrink-0 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-r border-sidebar-border px-4 py-6 text-sidebar-foreground md:flex ${className}`}>
          <m.div initial={reducedMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.18 }} className="mb-6 flex shrink-0 items-center justify-between gap-2">
            <Link href="/" aria-label="Hangry UI home" className="focus-visible:outline-2 focus-visible:outline-ring">
              <Logo variant="wordmark" className="w-36" />
            </Link>
            <m.button type="button" whileHover={reducedMotion ? undefined : { scale: 1.04 }} whileTap={reducedMotion ? undefined : { scale: 0.96 }} onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" title="Close sidebar" className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring">
              <PanelLeftClose size={22} aria-hidden="true" />
            </m.button>
          </m.div>
          <Navigation category={category} />
          <SidebarFooter />
        </m.aside>
      ) : (
        <m.aside key="collapsed" layout layoutRoot aria-label="Collapsed sidebar" className="sticky top-0 z-40 hidden h-dvh w-16 shrink-0 md:flex">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex w-16 min-h-0 flex-col gap-2 px-0 py-6">
            <m.button type="button" whileHover={reducedMotion ? undefined : { scale: 1.04 }} whileTap={reducedMotion ? undefined : { scale: 0.96 }} onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" title="Open sidebar" className="pointer-events-auto ml-3 group/toggle relative inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring motion-reduce:transition-none">
              <span aria-hidden="true" className="scale-100 opacity-100 transition-[opacity,transform] duration-200 ease-out group-hover/toggle:scale-90 group-hover/toggle:opacity-0 group-focus-visible/toggle:scale-90 group-focus-visible/toggle:opacity-0 motion-reduce:transform-none motion-reduce:transition-none">
                <Logo variant="logo" className="size-8" />
              </span>
              <PanelLeft size={20} aria-hidden="true" className="absolute scale-90 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover/toggle:scale-100 group-hover/toggle:opacity-100 group-focus-visible/toggle:scale-100 group-focus-visible/toggle:opacity-100 motion-reduce:transform-none motion-reduce:transition-none" />
            </m.button>
            <Navigation category={category} collapsed />
          </div>
        </m.aside>
      )}
      </AnimatePresence>
      <details className="group border-b border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4 focus-visible:outline-2 focus-visible:outline-sidebar-ring [&::-webkit-details-marker]:hidden">
          <PanelLeft size={20} aria-hidden="true" />
          <span className="flex-1 text-sm font-semibold">Library navigation</span>
          <ChevronDown size={18} aria-hidden="true" className="transition-transform group-open:rotate-180 motion-reduce:transition-none" />
        </summary>
        <div className="max-h-[75dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 pb-6" onClick={event => {
          if (!(event.target instanceof Element) || !event.target.closest('a')) return
          const disclosure = event.currentTarget.closest('details')
          disclosure?.removeAttribute('open')
          disclosure?.querySelector('summary')?.focus()
        }} onKeyDown={event => {
          if (event.key !== 'Escape') return
          const disclosure = event.currentTarget.closest('details')
          disclosure?.removeAttribute('open')
          disclosure?.querySelector('summary')?.focus()
        }}>
          <Navigation category={category} />
          <SidebarFooter />
        </div>
      </details>
    </LazyMotion>
  )
}
