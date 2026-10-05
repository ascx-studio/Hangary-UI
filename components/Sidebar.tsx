'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Heart, PanelLeft, PanelLeftClose } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { LazyMotion, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { DotsNav } from '@/components/ui/dots-nav'
import { GitHubDark } from '@ridemountainpig/svgl-react'
import sidebarData from '@/data/sidebar.json'
import { browseSection } from '@/data/Navlinks'
import type { RegistryCategory } from '@/lib/registry'
import Logo from '@/components/ui/Logo'
import { getSidebarOpen, getServerSidebarOpen, setSidebarOpen, subscribeSidebarOpen } from '@/lib/sidebar-state'

const loadFeatures = () => import('./ui/motion-features').then(module => module.default)
const MotionLink = m.create(Link)

function Navigation({ category, collapsed = false, expanded }: { category: RegistryCategory; collapsed?: boolean; expanded?: boolean }) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  const categoryConfig = sidebarData.categories[category as keyof typeof sidebarData.categories]
  const toLinks = (entries: { label: string; slug: string }[]) =>
    entries.map(({ label, slug }) => ({ label, href: `/${category}/${slug}` }))
  const entries: { label: string; slug: string; group?: string }[] = categoryConfig?.items ?? []
  const groupTitles = [...new Set(entries.map(item => item.group ?? categoryConfig?.title))]
  const sections = categoryConfig?.items.length
    ? groupTitles.map(title => ({ title, links: toLinks(entries.filter(item => (item.group ?? categoryConfig.title) === title)) }))
    : [{ title: browseSection.sidebarLabel, links: browseSection.links.map(({ label, href }) => ({ label, href })) }]
  sections.push({ title: 'Other', links: browseSection.links.map(({ label, href }) => ({ label, href })) })

  return (
    <nav aria-label="Documentation navigation" className={collapsed ? 'flex min-h-0 flex-1 flex-col gap-2' : 'flex min-h-0 flex-1 flex-col gap-6'}>
      {sections.map(section => (
        <div key={section.title} className={section.title === 'Other' ? `relative mt-auto shrink-0 ${collapsed ? 'pt-2 before:absolute before:inset-x-0 before:top-0 before:w-10 before:border-t before:border-sidebar-border' : 'border-t border-sidebar-border pt-4'}` : 'min-h-0 overflow-y-auto'}>
          {!collapsed && <h2 className="mb-2 text-sm font-semibold text-muted-foreground/80">{section.title}</h2>}
          {collapsed ? <DotsNav
            aria-label={section.title}
            items={section.links.map(link => ({ title: link.label, href: link.href }))}
            activeHref={section.links.find(link => pathname === link.href || section.title === 'Other' && pathname.startsWith(`${link.href}/`))?.href}
            orientation="vertical"
            expanded={expanded}
            className="w-full"
          /> : <ul className="space-y-3 pl-4">
            {section.links.map(link => {
              const active = pathname === link.href || (section.title === 'Other' && pathname.startsWith(`${link.href}/`))
              return (
                <li key={link.href}>
                  <MotionLink href={link.href} aria-current={active ? 'page' : undefined}
                    initial={false} animate={{ scale: 1, color: active ? 'var(--sidebar-foreground)' : 'var(--muted-foreground)' }}
                    whileHover={{ scale: reducedMotion ? 1 : 1.14, color: 'var(--sidebar-foreground)' }}
                    whileFocus={{ scale: reducedMotion ? 1 : 1.14, color: 'var(--sidebar-foreground)' }}
                    transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 26, mass: 0.8 }}
                    className="flex min-w-0 origin-left items-center py-0.5 text-sm font-medium leading-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sidebar-ring">
                    {link.label}
                  </MotionLink>
                </li>
              )
            })}
          </ul>}
        </div>
      ))}
    </nav>
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

export default function Sidebar({ category, className = "" }: { category: RegistryCategory; className?: string }) {
  const desktopOpen = useSyncExternalStore(subscribeSidebarOpen, getSidebarOpen, getServerSidebarOpen)
  return (
    <LazyMotion features={loadFeatures} strict>
      {desktopOpen ? (
        <aside className={`sticky top-0 hidden h-dvh w-70 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border px-4 py-6 text-sidebar-foreground md:flex ${className}`}>
          <div className="mb-6 flex shrink-0 items-center justify-between gap-2">
            <Link href="/" aria-label="Hangry UI home" className="focus-visible:outline-2 focus-visible:outline-ring">
              <Logo variant="wordmark" className="w-36" />
            </Link>
            <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" title="Close sidebar" className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring">
              <PanelLeftClose size={22} aria-hidden="true" />
            </button>
          </div>
          <Navigation category={category} />
          <SidebarFooter />
        </aside>
      ) : (
        <aside aria-label="Collapsed sidebar" className="sticky top-0 z-40 hidden h-dvh w-16 shrink-0 md:flex">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex w-64 min-h-0 flex-col gap-2 overflow-hidden px-3 py-6">
            <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" title="Open sidebar" className="pointer-events-auto group/toggle relative inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring motion-reduce:transition-none">
              <span aria-hidden="true" className="scale-100 opacity-100 transition-[opacity,transform] duration-200 ease-out group-hover/toggle:scale-90 group-hover/toggle:opacity-0 group-focus-visible/toggle:scale-90 group-focus-visible/toggle:opacity-0 motion-reduce:transform-none motion-reduce:transition-none">
                <Logo variant="logo" className="size-8" />
              </span>
              <PanelLeft size={20} aria-hidden="true" className="absolute scale-90 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover/toggle:scale-100 group-hover/toggle:opacity-100 group-focus-visible/toggle:scale-100 group-focus-visible/toggle:opacity-100 motion-reduce:transform-none motion-reduce:transition-none" />
            </button>
            <Navigation category={category} collapsed />
          </div>
        </aside>
      )}
      <details className="group border-b border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4 focus-visible:outline-2 focus-visible:outline-sidebar-ring [&::-webkit-details-marker]:hidden">
          <PanelLeft size={20} aria-hidden="true" />
          <span className="flex-1 text-sm font-semibold">Library navigation</span>
          <ChevronDown size={18} aria-hidden="true" className="transition-transform group-open:rotate-180 motion-reduce:transition-none" />
        </summary>
        <div className="max-h-[75dvh] overflow-y-auto px-4 pb-6" onClick={event => {
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
