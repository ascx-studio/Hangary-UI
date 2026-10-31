import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Catalog from "@/components/registry/catalog";
import { pageMetadata } from "@/lib/seo";
import type { ResolvingMetadata } from "next";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata(
    "/blocks",
    "React Page Blocks",
    "Ready-to-use React navbars, footers, login forms, and pricing sections. Explore live previews and install Tailwind CSS blocks with shadcn.",
    await parent,
  );
}

export default function Page() {
  return (
    <div className="page-entrance isolate flex min-h-dvh w-full min-w-0 flex-col">
      <div className="relative z-10 min-h-dvh w-full flex-1 bg-background">
        <Container className="p-4">
          <h1 className={"typography-page-title"}>Blocks</h1>
          <p className={`mt-5 typography-body`}>
            Complete sections for your next page. Explore their previews and adapt the details to
            your project.
          </p>
          <Catalog category="blocks" />
        </Container>
      </div>
      <Footer />
    </div>
  );
}
