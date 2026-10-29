import DetailPage from "@/components/registry/detail-page";
import { getRegistryItem, getRegistryItemHref, getRegistryItems } from "@/lib/registry";
import { pageMetadata, registrySeo, siteUrl } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { ResolvingMetadata } from "next";

export function generateStaticParams() {
  return getRegistryItems("components").map((item) => ({ slugs: item.name }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slugs: string }> },
  parent?: ResolvingMetadata,
) {
  const { slugs } = await params;
  const item = getRegistryItem(slugs, "components");
  if (!item) notFound();
  const seo = registrySeo(item, "components");
  const metadata = pageMetadata(
    getRegistryItemHref(item),
    seo.title,
    seo.description,
    await parent,
  );
  const image = {
    url: new URL(`/previews/${item.name}.png`, siteUrl).href,
    alt: `${item.title} React component preview`,
  };
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [image] },
    twitter: { ...metadata.twitter, images: [image.url] },
  };
}

export default async function Page({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params;
  return <DetailPage name={slugs} category="components" />;
}
