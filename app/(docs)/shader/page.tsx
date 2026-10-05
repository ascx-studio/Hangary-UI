import Container from '@/components/layout/Container'
import Catalog from "@/components/registry/catalog";
import { pageMetadata } from "@/lib/seo";
import type { ResolvingMetadata } from "next";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata('/shader', 'React Shaders & Background Effects', 'Animated shaders and background effects for React. Explore live previews, copy the source, and add visual effects to your next interface.', await parent);
}

export default function Page() {

  return (
    <div className="page-entrance w-full min-w-0">
      <Container className="p-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Shaders</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Animated shaders and visual effects, ready to explore in a live preview.</p>
        <Catalog category="shader" />
      </Container>
    </div>
  )
}
