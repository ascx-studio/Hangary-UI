import type { Metadata, ResolvedMetadata } from "next";
import { homepage } from "@/registry.json";

export const siteUrl = new URL(homepage).origin;
export const siteDescription = "React UI components, page blocks, and vgpu WebGPU shaders. Explore live previews, Tailwind CSS styling, and install components with shadcn.";

export function pageMetadata(path: string, title: string, description: string, parent?: ResolvedMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: new URL(path.split("#")[0], siteUrl).href },
    openGraph: {
      ...parent?.openGraph,
      title: `${title} | Hangry UI`,
      description,
      url: new URL(path.split("#")[0], siteUrl).href,
      siteName: "Hangry UI",
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      ...parent?.twitter,
      card: "summary_large_image",
      title: `${title} | Hangry UI`,
      description,
    },
  };
}

/** Only GPU-backed items should target vgpu/WebGPU queries. */
export function usesVgpu(item: { dependencies?: string[] }): boolean {
  return item.dependencies?.some(dependency => /^vgpu(?:@|$)/.test(dependency)) ?? false;
}

export function registrySeo(item: { title: string; description: string; dependencies?: string[] }, category: string) {
  if (category === "shader") {
    const technology = usesVgpu(item) ? "vgpu WebGPU shader for React" : "React background component";
    return {
      title: `${item.title} – ${usesVgpu(item) ? "vgpu React Shader" : "React Background"}`,
      description: `${item.title}, a ${technology}. ${item.description} Live preview, props, and shadcn install.`,
    };
  }
  return {
    title: `${item.title} – React ${category === "blocks" ? "Block" : "UI Component"}`,
    description: `${item.description} Explore the ${item.title} React ${category === "blocks" ? "block" : "component"}, with live preview, props, and shadcn installation.`,
  };
}

export function registryStructuredData(item: { name: string; title: string; description: string; dependencies?: string[]; files: { path: string }[] }, category: string, path: string) {
  const seo = registrySeo(item, category);
  const url = new URL(path.split("#")[0], siteUrl).href;
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#documentation`,
    headline: seo.title,
    description: seo.description,
    url,
    image: new URL(`/previews/${item.name}.png`, siteUrl).href,
    inLanguage: "en",
    author: { "@type": "Organization", name: "Hangry UI", url: siteUrl },
    mainEntityOfPage: url,
    mainEntity: {
      "@type": "SoftwareSourceCode",
      name: item.title,
      description: item.description,
      codeRepository: "https://github.com/ascx-studio/ui",
      codeSampleType: "full solution",
      programmingLanguage: item.files.some(file => file.path.endsWith(".wgsl")) ? ["TypeScript", "WGSL"] : ["TypeScript"],
      runtimePlatform: usesVgpu(item) ? "React, WebGPU, vgpu" : "React",
    },
  };
}
