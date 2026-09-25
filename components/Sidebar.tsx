'use client'

import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/data/Sidebarlinks'
import Button from '@/components/Button'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-70 shrink-0 border-r border-sidebar-border bg-sidebar px-6 py-4 text-sidebar-foreground">
      <nav aria-label="Documentation navigation" className="space-y-16">
        {sidebarLinks.map((section) => (
          <div key={section.title}>
            <h2 className="mb-5 text-sm font-normal text-muted-foreground">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Button
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={`w-full focus-visible:outline-sidebar-ring justify-start rounded-none p-2 text-base leading-tight no-underline transition-colors ${
                      pathname === link.href
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline'
                    }`}
                    href={link.href}
                    type="link"
                    variant="link"
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
