import { notFound } from "next/navigation";
import { getRegistryItem, type RegistryCategory } from "@/lib/registry";

export default async function DetailPage({ name, category }: { name: string; category: RegistryCategory }) {
  const item = getRegistryItem(name, category);
  if (!item) notFound();
  const folder = category === "components" ? "[slugs]" : "[slug]";
  const { default: Content } = await import(`../../app/(docs)/${category}/${folder}/${name}.mdx`);

  return <article className="page-entrance w-full min-w-0 px-6 py-10 sm:px-10 md:px-12 md:py-14 [&>*:not([data-slot=component-preview])]:mx-auto [&>*:not([data-slot=component-preview])]:w-full [&>*:not([data-slot=component-preview])]:max-w-6xl"><Content /></article>;
}
