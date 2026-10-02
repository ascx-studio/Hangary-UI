import Container from '@/components/layout/Container'
import Catalog from "@/components/registry/catalog";

export const metadata = { title: 'Components | Lazy UI', description: 'Reusable interface pieces with previews, installation instructions, and source code.' }

export default function Page() {
  return (
    <div className="page-entrance w-full min-w-0">
      <Container className="p-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Components</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Reusable interface pieces with previews, installation instructions, and source code.</p>
        <Catalog category="components" />
      </Container>
    </div>
  )
}
