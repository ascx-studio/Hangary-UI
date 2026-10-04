'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Heart, PanelLeft, PanelLeftClose } from 'lucide-react'
import { useState } from 'react'
import { GitHubDark } from '@ridemountainpig/svgl-react'
import sidebarData from '@/data/sidebar.json'
import { browseSection } from '@/data/Navlinks'
import type { RegistryCategory } from '@/lib/registry'

function Navigation({ category, collapsed = false }: { category: RegistryCategory; collapsed?: boolean }) {
  const pathname = usePathname()
  const categoryConfig = sidebarData.categories[category as keyof typeof sidebarData.categories]
  const toLinks = (entries: { label: string; slug: string }[]) =>
    entries.map(({ label, slug }) => ({ label, href: `/${category}/${slug}` }))
  const entries: { label: string; slug: string; group?: string }[] = categoryConfig?.items ?? []
  const groupTitles = [...new Set(entries.map(item => item.group ?? categoryConfig?.title))]
  const sections = categoryConfig?.items.length
    ? groupTitles.map(title => ({ title, links: toLinks(entries.filter(item => (item.group ?? categoryConfig.title) === title)) }))
    : [{ title: browseSection.sidebarLabel, links: browseSection.links.map(({ label, href }) => ({ label, href })) }]

  return (
    <nav aria-label="Documentation navigation" className={collapsed ? 'flex flex-col gap-2' : 'space-y-10'}>
      {sections.map(section => (
        <div key={section.title} className={collapsed ? 'border-t border-sidebar-border pt-2 first:border-t-0 first:pt-0' : undefined}>
          {!collapsed && <h2 className="mb-2 text-sm font-semibold text-muted-foreground/80">{section.title}</h2>}
          <ul className={collapsed ? 'space-y-1' : 'space-y-3 pl-4'}>
            {section.links.map(link => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={active ? 'page' : undefined} aria-label={collapsed ? link.label : undefined} title={collapsed ? link.label : undefined} className={collapsed ? `group/item relative flex size-10 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-sidebar-ring ${active ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'}` : `flex min-w-0 items-center py-0.5 text-sm font-medium leading-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sidebar-ring ${active ? 'text-sidebar-foreground' : 'text-muted-foreground hover:text-sidebar-foreground'}`}>
                    {collapsed ? <>
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                      <span aria-hidden="true" className="pointer-events-none invisible absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-sidebar-border bg-sidebar px-3 py-2 text-sm text-sidebar-foreground opacity-0 shadow-xl group-hover/item:visible group-hover/item:opacity-100 group-focus-visible/item:visible group-focus-visible/item:opacity-100">{link.label}</span>
                    </> : link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function SidebarFooter() {
  const linkClass = "inline-flex items-center gap-2 rounded-sm py-2 text-sm text-muted-foreground hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
  return (
    <nav aria-label="Support and community" className="mt-auto flex items-center justify-center gap-3 pt-8">
      <Link href="/support" className={linkClass}><Heart size={16} aria-hidden="true" />Support</Link>
      <span aria-hidden="true" className="text-muted-foreground">|</span>
      <a href="https://github.com/ascx-studio/ui" target="_blank" rel="noreferrer" className={linkClass}><GitHubDark className="size-4" aria-hidden="true" />GitHub</a>
    </nav>
  )
}

export default function Sidebar({ category, className = "" }: { category: RegistryCategory; className?: string }) {
  const [desktopOpen, setDesktopOpen] = useState(true)
  return (
    <>
      {desktopOpen ? (
        <aside className={`sticky top-0 hidden h-dvh w-70 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border px-4 py-6 text-sidebar-foreground md:flex ${className}`}>
          <div className="mb-6 flex">
            <button type="button" onClick={() => setDesktopOpen(false)} aria-label="Close sidebar" title="Close sidebar" className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring">
              <PanelLeftClose size={22} aria-hidden="true" />
            </button>
          </div>
          <Navigation category={category} />
          <SidebarFooter />
        </aside>
      ) : (
        <aside aria-label="Collapsed sidebar" className="sticky top-0 hidden h-dvh w-16 shrink-0 px-4 py-6 md:flex">
          <div className="sticky top-4 flex flex-col gap-2">
            <button type="button" onClick={() => setDesktopOpen(true)} aria-label="Open sidebar" title="Open sidebar" className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring">
              <PanelLeft size={20} aria-hidden="true" />
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
    </>
  )
}
