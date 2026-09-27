'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Heart, PanelLeft, PanelLeftClose } from 'lucide-react'
import { useState } from 'react'
import { GitHubDark } from '@ridemountainpig/svgl-react'
import { sidebarLinks } from '@/data/Sidebarlinks'
import Logo from '@/components/ui/Logo'
import Icon from '@/components/Icon'
import { browseSection } from '@/data/Navlinks'

type SidebarItem = { label: string; href: string; category: string }

function BrandDropdown() {
  const pathname = usePathname()
  const section = browseSection
  const current = section.links.find(link => pathname === link.href || pathname.startsWith(`${link.href}/`))

  return (
    <div className="relative mb-8 flex items-center gap-2 px-2">
      <Link href="/" aria-label="Hangry UI home" className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-sidebar-ring"><Logo variant="logo" className="size-10 shrink-0" /></Link>
      <details className="group/browse" onKeyDown={event => {
        if (event.key !== 'Escape') return
        event.stopPropagation()
        event.currentTarget.removeAttribute('open')
        event.currentTarget.querySelector('summary')?.focus()
      }}>
        <summary aria-label={`Browse library, current section: ${current?.label ?? section.label}`} title={current?.label ?? section.label} className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-sidebar-ring [&::-webkit-details-marker]:hidden">
          {current && <Icon name={current.icon} size={18} className="shrink-0" />}
          <span>{current?.label ?? section.label}</span>
          <ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform group-open/browse:rotate-180 motion-reduce:transition-none" />
        </summary>
        <nav aria-label="Browse library" className="absolute inset-x-0 top-full z-30 mt-2 rounded-lg border border-sidebar-border bg-popover p-2 text-popover-foreground shadow-xl">
          <p className="px-3 py-2 text-xs text-muted-foreground">{section.label}</p>
          {section.links.map(link => (
            <Link key={link.href} href={link.href} aria-current={current?.href === link.href ? 'page' : undefined} onClick={event => {
              const disclosure = event.currentTarget.closest('details')
              disclosure?.removeAttribute('open')
              disclosure?.querySelector('summary')?.focus()
            }} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground">
              <Icon name={link.icon} size={18} />{link.label}
            </Link>
          ))}
        </nav>
      </details>
    </div>
  )
}

function Navigation({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname()
  const category = pathname.split('/')[1]
  const currentSection = browseSection.links.find(link => link.href === `/${category}`)
  const sections = currentSection ? [
    {
      title: currentSection.label,
      links: items.filter(item => item.category === category),
    },
  ] : sidebarLinks.filter(section => section.title !== 'Project')

  return (
    <nav aria-label="Documentation navigation" className="space-y-8">
      {sections.map(section => (
        <div key={section.title}>
          <h2 className="mb-3 px-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">{section.title}</h2>
          <ul className="space-y-1">
            {section.links.map(link => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={active ? 'page' : undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}>
                    {link.label}
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
      <Link href="/sponser" className={linkClass}><Heart size={16} aria-hidden="true" />Support</Link>
      <span aria-hidden="true" className="text-muted-foreground">|</span>
      <a href="https://github.com/razeevascx/lazy-ui" target="_blank" rel="noreferrer" className={linkClass}><GitHubDark className="size-4" aria-hidden="true" />GitHub</a>
    </nav>
  )
}

export default function Sidebar({ items }: { items: SidebarItem[] }) {
  const [desktopOpen, setDesktopOpen] = useState(true)
  return (
    <>
      {desktopOpen ? (
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground md:flex">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1"><BrandDropdown /></div>
            <button type="button" onClick={() => setDesktopOpen(false)} aria-label="Close sidebar" title="Close sidebar" className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring">
              <PanelLeftClose size={18} aria-hidden="true" />
            </button>
          </div>
          <Navigation items={items} />
          <SidebarFooter />
        </aside>
      ) : (
        <div className="sticky top-0 hidden h-dvh w-12 shrink-0 flex-col items-center border-r border-sidebar-border bg-sidebar py-4 md:flex">
          <button type="button" onClick={() => setDesktopOpen(true)} aria-label="Open sidebar" title="Open sidebar" className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring">
            <PanelLeft size={18} aria-hidden="true" />
          </button>
        </div>
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
          <BrandDropdown />
          <Navigation items={items} />
          <SidebarFooter />
        </div>
      </details>
    </>
  )
}
