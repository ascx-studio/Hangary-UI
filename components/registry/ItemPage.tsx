import type { ReactNode } from 'react'
import Link from 'next/link'
import Container from '@/layout/Container'
import ComponentPreview from './ComponentPreview';

export default function ItemPage({ title, description, category, categoryLabel,  preview,  }: {
  title: string
  description: string
  category: string
  categoryLabel: string
  badge?: string
  preview: ReactNode
  children: ReactNode
}) {
  return (
    <Container className="py-10 md:py-14">
      <article className="min-w-0 w-full">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link className="hover:text-foreground" href={`/${category}`}>{categoryLabel}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">{title}</li>
          </ol>
        </nav>
        <header className="my-8 md:my-10">
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
        </header>

        <ComponentPreview>{preview}</ComponentPreview>

      </article>
    </Container>
  )
}
