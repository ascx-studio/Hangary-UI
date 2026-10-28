import DetailPage from "@/components/registry/detail-page";
import { getRegistryItem, getRegistryItemHref, getRegistryItems } from "@/lib/registry";
import { pageMetadata, registrySeo, siteUrl } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { ResolvingMetadata } from "next";

export function generateStaticParams() {
  return getRegistryItems("shader").map(item => ({ slug: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }, parent?: ResolvingMetadata) {
  const { slug } = await params;
  const item = getRegistryItem(slug, "shader");
  if (!item) notFound();
  const seo = registrySeo(item, "shader");
  const metadata = pageMetadata(getRegistryItemHref(item), seo.title, seo.description, await parent);
  const image = { url: new URL(`/previews/${item.name}.png`, siteUrl).href, alt: `${item.title} React component preview` };
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [image] },
    twitter: { ...metadata.twitter, images: [image.url] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DetailPage name={slug} category="shader" />;
}
