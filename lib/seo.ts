import type { Metadata, ResolvedMetadata } from "next";
import { homepage } from "@/registry.json";

export const siteUrl = new URL(homepage).origin;
export const siteDescription = "Reusable React components, page blocks, and shaders built with Tailwind CSS. Explore live previews, copy source code, and install with shadcn.";

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
