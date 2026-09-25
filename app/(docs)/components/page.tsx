import type { Metadata } from 'next'
import Link from 'next/link'
import RegistryCatalog from '@/components/registry/RegistryCatalog'
import Container from '@/layout/Container'

export const metadata: Metadata = {
  title: 'Components | Lazy UI',
  description: 'Focused building blocks for your interface. Each component includes interactive live previews, installable shadcn CLI commands, and full source code.',
}

const coreComponents = [
  { name: 'Button', slug: 'button', desc: 'Interactive actions, variants & links' },
  { name: 'Card', slug: 'card', desc: 'Surface container with border & shadow' },
  { name: 'Badge', slug: 'badge', desc: 'Status labels & category tags' },
  { name: 'Alert', slug: 'alert', desc: 'Contextual notification banners' },
  { name: 'Separator', slug: 'separator', desc: 'Horizontal & vertical dividers' },
  { name: 'Icon', slug: 'icon', desc: 'Optimized interface icons' },
  { name: 'Logo', slug: 'logo', desc: 'Brand logo & wordmark marks' },
]

export default function ComponentsPage() {
  return (
    <Container className="pb-16">
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Components</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Focused building blocks for your interface. Each component includes interactive live previews, installable shadcn CLI commands, and full source code.
      </p>

      <section className="mt-10" aria-label="Core UI components">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Core UI Primitives</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {coreComponents.map((item) => (
            <Link
              key={item.slug}
              href={`/components/${item.slug}`}
              className="group flex flex-col justify-between rounded-md border border-border bg-card p-4 transition-all hover:border-primary/60 hover:shadow-xs"
            >
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <RegistryCatalog category="components" />
    </Container>
  )
}
