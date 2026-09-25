import type { Metadata } from 'next'
import RegistryCatalog from '@/components/registry/RegistryCatalog'
import Container from '@/layout/Container'

export const metadata: Metadata = {
  title: 'Utility code | Lazy UI',
  description: 'Helpers and React hooks for everyday interface work. Browse the source and setup details, then bring only what you need into your project.',
}

export default function UtilsPage() {
  return (
    <Container className="pb-16">
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Utility code</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Helpers and React hooks for everyday interface work. Browse the source and setup details, then bring only what you need into your project.
      </p>
      <RegistryCatalog category="utils" />
    </Container>
  )
}
