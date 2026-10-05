import DetailPage from "@/components/registry/detail-page";
import { getRegistryItem, getRegistryItemHref, getRegistryItems } from "@/lib/registry";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { ResolvingMetadata } from "next";

export function generateStaticParams() {
  return getRegistryItems("shader").map(item => ({ slug: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }, parent?: ResolvingMetadata) {
  const { slug } = await params;
  const item = getRegistryItem(slug, "shader");
  if (!item) notFound();
  return pageMetadata(getRegistryItemHref(item), item.title, item.description, await parent);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DetailPage name={slug} category="shader" />;
}
