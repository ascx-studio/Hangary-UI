import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Catalog from "@/components/registry/catalog";
import { pageMetadata } from "@/lib/seo";
import type { ResolvingMetadata } from "next";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata(
    "/components",
    "React UI Components",
    "Reusable React UI components with live previews, installation instructions, and source code. Built with Tailwind CSS for your next interface.",
    await parent,
  );
}

export default function Page() {
  return (
    <div className="page-entrance isolate flex min-h-dvh w-full min-w-0 flex-col">
      <div className="relative z-10 min-h-dvh w-full flex-1 bg-background">
        <Container className="p-4">
          <h1 className={"typography-page-title"}>Components</h1>
          <p className={`mt-5 typography-body`}>
            Reusable interface pieces with previews, installation instructions, and source code.
          </p>
          <Catalog category="components" />
        </Container>
      </div>
      <Footer />
    </div>
  );
}
