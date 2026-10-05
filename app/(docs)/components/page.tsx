import Container from '@/components/layout/Container'
import Catalog from "@/components/registry/catalog";
import { pageMetadata } from "@/lib/seo";
import type { ResolvingMetadata } from "next";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata('/components', 'React UI Components', 'Reusable React UI components with live previews, installation instructions, and source code. Built with Tailwind CSS for your next interface.', await parent);
}

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
