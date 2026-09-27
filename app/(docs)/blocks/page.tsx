import PageEntrance from "@/components/PageEntrance";
import Container from '@/components/layout/Container'
import Catalog from "@/components/registry/catalog";

export const metadata = { title: 'Blocks | Lazy UI', description: 'Complete sections for your next page. Explore their previews and adapt the details to your project.' }

export default function Page() {

  return (
    <PageEntrance>
      <Container className="p-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Blocks</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Complete sections for your next page. Explore their previews and adapt the details to your project.</p>
        <Catalog category="blocks" />
      </Container>
    </PageEntrance>
  )
}
