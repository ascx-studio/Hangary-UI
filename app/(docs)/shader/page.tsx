import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Catalog from "@/components/registry/catalog";
import { pageMetadata } from "@/lib/seo";
import type { ResolvingMetadata } from "next";

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata) {
  return pageMetadata(
    "/shader",
    "vgpu React Shaders & WebGPU UI Components",
    "Explore vgpu-powered React shaders, WebGPU backgrounds, and CSS effects. Preview UI components, read their props, and install with shadcn.",
    await parent,
  );
}

export default function Page() {
  return (
    <div className="page-entrance isolate flex min-h-dvh w-full min-w-0 flex-col">
      <div className="relative z-10 min-h-dvh w-full flex-1 bg-background">
        <Container className="p-4">
          <h1 className={"typography-page-title"}>vgpu React Shaders &amp; Backgrounds</h1>
          <p className={`mt-5 typography-body`}>
            Build React interfaces with vgpu-powered WebGPU shaders, animated backgrounds, and CSS
            effects. Each UI component includes a live preview, documented props, and a shadcn
            install command.
          </p>
          <p className="mt-4 typography-body">
            Use WGSL shaders for interactive water, light rays, gradients, and procedural effects.
            GPU-backed components use vgpu, support reduced motion, and provide a fallback when
            WebGPU is unavailable. CSS and SVG backgrounds are also available for effects that do
            not require WebGPU.
          </p>
          <Catalog category="shader" />
        </Container>
      </div>
      <Footer />
    </div>
  );
}
