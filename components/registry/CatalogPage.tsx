import type { ReactNode } from 'react'
import Container from '@/layout/Container'

export default function CatalogPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Container className="p-4">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{description}</p>
      </header>
      {children}
    </Container>
  )
}
