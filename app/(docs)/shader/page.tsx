import type { Metadata } from 'next'
import RegistryCatalog from '@/components/registry/RegistryCatalog'
import Container from '@/layout/Container'

export const metadata: Metadata = {
  title: 'Shaders | Lazy UI',
  description: 'Visual effects and shader components for your interface. Check each entry for browser requirements and dependencies before adding it to a project.',
}

export default function ShaderPage() {
  return (
    <Container className="pb-16">
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Shaders</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Visual effects and shader components for your interface. Check each entry for browser requirements and dependencies before adding it to a project.
      </p>
      <RegistryCatalog category="shader" />
    </Container>
  )
}
