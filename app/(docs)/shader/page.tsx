import PageEntrance from "@/components/PageEntrance";
import Container from '@/components/layout/Container'
import Catalog from "@/components/registry/catalog";

export const metadata = { title: 'Shaders | Lazy UI', description: 'Animated backgrounds and visual effects, ready to explore in a live preview.' }

export default function Page() {

  return (
    <PageEntrance>
      <Container className="p-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Shaders</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Animated backgrounds and visual effects, ready to explore in a live preview.</p>
        <Catalog category="shader" />
      </Container>
    </PageEntrance>
  )
}
