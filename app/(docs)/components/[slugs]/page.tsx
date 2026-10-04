import { notFound } from "next/navigation";
import { getRegistryItem, getRegistryItems } from "@/lib/registry";
import { logCatalogDetailRendered } from "@/lib/posthog-logger";

export function generateStaticParams() {
  return getRegistryItems("components").map(item => ({ slugs: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params;
  const item = getRegistryItem(slugs, "components");
  return { title: item ? `${item.title} | Lazy UI` : "Registry item not found | Lazy UI", description: item?.description };
}

export default async function Page({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params;
  if (!getRegistryItem(slugs, "components")) notFound();
  logCatalogDetailRendered("components", slugs);
  const { default: Content } = await import(`./${slugs}.mdx`);
  return <article className="page-entrance w-full min-w-0 px-6 py-10 sm:px-10 md:px-12 md:py-14 [&>*:not([data-slot=component-preview])]:mx-auto [&>*:not([data-slot=component-preview])]:w-full [&>*:not([data-slot=component-preview])]:max-w-4xl"><Content /></article>;
}
