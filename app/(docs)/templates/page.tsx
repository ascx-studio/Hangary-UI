import PageEntrance from "@/components/PageEntrance";
import Container from '@/components/layout/Container'
import Catalog from "@/components/registry/catalog";

export const metadata = { title: 'Templates | Lazy UI' }

export default function Page() {
  return (
    <PageEntrance>
      <Container className="p-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Templates</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Explore page compositions and make them your own.</p>
        <Catalog category="templates" />
      </Container>
    </PageEntrance>
  )
}
