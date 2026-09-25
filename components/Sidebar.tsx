'use client'

import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/data/Sidebarlinks'
import Button from '@/components/Button'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-70 shrink-0 border-r border-base-300 px-6 py-4 text-foreground">
      <nav aria-label="Documentation navigation" className="space-y-16">
        {sidebarLinks.map((section) => (
          <div key={section.title}>
            <h2 className="mb-5 text-sm font-normal text-base-content/60">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Button
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={`w-full justify-start rounded-none p-2 text-md leading-tight no-underline transition-colors ${
                      pathname === link.href
                        ? 'bg-base-300 text-foreground hover:bg-base-300'
                        : 'text-base-content hover:bg-base-200 hover:no-underline'
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
