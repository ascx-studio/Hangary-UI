import Container from '@/components/layout/Container'
import Catalog from "@/components/registry/catalog";
import { pageMetadata } from "@/lib/seo";
import type { ResolvingMetadata } from "next";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata('/blocks', 'React Page Blocks', 'Ready-to-use React navbars, footers, login forms, and pricing sections. Explore live previews and install Tailwind CSS blocks with shadcn.', await parent);
}

export default function Page() {

  return (
    <div className="page-entrance w-full min-w-0">
      <Container className="p-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Blocks</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Complete sections for your next page. Explore their previews and adapt the details to your project.</p>
        <Catalog category="blocks" />
      </Container>
    </div>
  )
}
