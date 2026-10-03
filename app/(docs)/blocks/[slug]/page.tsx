import { notFound } from "next/navigation";
import { getRegistryItem, getRegistryItems } from "@/lib/registry";

export function generateStaticParams() {
  return getRegistryItems("blocks").map(item => ({ slug: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getRegistryItem(slug, "blocks");
  return { title: item ? `${item.title} | Lazy UI` : "Registry item not found | Lazy UI", description: item?.description };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getRegistryItem(slug, "blocks")) notFound();
  const { default: Content } = await import(`./${slug}.mdx`);
  return <article className="page-entrance w-full min-w-0 px-6 py-10 sm:px-10 md:px-12 md:py-14 [&>*:not([data-slot=component-preview])]:mx-auto [&>*:not([data-slot=component-preview])]:w-full [&>*:not([data-slot=component-preview])]:max-w-5xl"><Content /></article>;
}
