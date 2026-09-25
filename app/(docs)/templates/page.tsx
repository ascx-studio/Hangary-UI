import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/layout/Container'

export const metadata: Metadata = {
  title: 'Templates | Lazy UI',
  description: 'Build your own pages with Lazy UI blocks and components.',
}

export default function TemplatesPage() {
  return (
    <Container className="pb-16">
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Templates</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Full project templates are not available yet. The registry includes
        blocks you can combine into your own pages.
      </p>
      <section className="mt-10 max-w-2xl border-t border-border pt-8" aria-labelledby="build-a-page">
        <h2 id="build-a-page" className="text-xl font-medium text-foreground">Start with a block</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Blocks provide individual sections or layouts. A template would include
          a complete project with its routes, configuration, and content. Choose
          a block for your page, then adapt the components and utilities to fit.
        </p>
        <ul className="mt-6 space-y-4">
          {[
            { href: '/blocks', label: 'Browse blocks', description: 'Sections and layouts to start from.' },
            { href: '/components', label: 'Browse components', description: 'Smaller pieces to customize your interface.' },
            { href: '/utils', label: 'Browse utilities', description: 'Helpers and hooks for the behavior you need.' },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                {item.label}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  )
}
