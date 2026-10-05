import DetailPage from "@/components/registry/detail-page";
import { getRegistryItem, getRegistryItemHref, getRegistryItems } from "@/lib/registry";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { ResolvingMetadata } from "next";

export function generateStaticParams() {
  return getRegistryItems("components").map(item => ({ slugs: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slugs: string }> }, parent?: ResolvingMetadata) {
  const { slugs } = await params;
  const item = getRegistryItem(slugs, "components");
  if (!item) notFound();
  return pageMetadata(getRegistryItemHref(item), item.title, item.description, await parent);
}

export default async function Page({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params;
  return <DetailPage name={slugs} category="components" />;
}
