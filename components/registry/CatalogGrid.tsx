import Link from 'next/link'
import { ArrowUpRight, Box, Layers, Sparkles, Code2, LayoutTemplate } from 'lucide-react'

const icons = { components: Box, blocks: Layers, shader: Sparkles, utils: Code2, templates: LayoutTemplate }

export default function CatalogGrid({ items, category }: {
  category: keyof typeof icons
  items: { name: string; title: string; description: string; href: string; badge: string; detail: string }[]
}) {
  const Icon = icons[category]
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => <li key={item.name} className="min-w-0">
        <Link href={item.href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
          <div aria-hidden="true" className="relative flex h-28 items-center justify-center border-b border-border bg-gradient-to-br from-primary/10 via-muted/20 to-background">
            <div className="rounded-xl border border-border bg-background/80 p-4 text-primary transition-transform group-hover:-translate-y-1"><Icon size={28} strokeWidth={1.4} /></div>
            <ArrowUpRight size={16} className="absolute right-4 top-4 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="text-base font-semibold tracking-tight group-hover:text-primary">{item.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6 text-xs text-muted-foreground">
              <span className="rounded-full border border-border px-2.5 py-1">{item.badge}</span>
              <span>{item.detail}</span>
            </div>
          </div>
        </Link>
      </li>)}
    </ul>
  )
}
