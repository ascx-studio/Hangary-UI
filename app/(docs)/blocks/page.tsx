import type { Metadata } from 'next'
import RegistryCatalog from '@/components/registry/RegistryCatalog'
import Container from '@/layout/Container'

export const metadata: Metadata = {
  title: 'Blocks | Lazy UI',
  description: 'Ready-to-adapt sections and page layouts from the portfolio. Each entry includes its supporting components and setup notes.',
}

export default function BlocksPage() {
  return (
    <Container className="pb-16">
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Blocks</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Ready-to-adapt sections and page layouts from the portfolio. Each entry includes its supporting components and setup notes.
      </p>
      <RegistryCatalog category="blocks" />
    </Container>
  )
}
