import PageEntrance from "@/components/PageEntrance";
import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/layout/Container'
import Content from '@/docs/templates/portfolio.mdx'

export const metadata: Metadata = { title: 'Portfolio example | Lazy UI', description: 'A portfolio page composed from Lazy UI components.' }

export default function Page() {
  return (
    <PageEntrance>
      <Container className="py-6 md:py-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link className="hover:text-foreground" href="/templates">Templates</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">Portfolio</li>
          </ol>
        </nav>
        <h1 className="mb-5 text-4xl font-semibold tracking-tight md:text-5xl">Portfolio</h1>
        <Content />
      </Container>
    </PageEntrance>
  )
}
