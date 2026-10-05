import { notFound, permanentRedirect } from "next/navigation";
import { getRegistryItem, getRegistryItemHref, type RegistryCategory } from "@/lib/registry";
import { logCatalogDetailRendered } from "@/lib/posthog-logger";
import JsonLd from "@/components/seo/JsonLd";
import { siteUrl } from "@/lib/seo";

export default async function DetailPage({ name, category }: { name: string; category: RegistryCategory }) {
  const item = getRegistryItem(name, category);
  if (!item) notFound();
  if (item.meta?.documentationPage) permanentRedirect(getRegistryItemHref(item));
  if (category === "components" || category === "blocks") logCatalogDetailRendered(category, name);
  const folder = category === "components" ? "[slugs]" : "[slug]";
  const { default: Content } = await import(`../../app/(docs)/${category}/${folder}/${name}.mdx`);

  const categoryTitle = { components: "Components", blocks: "Blocks", shader: "Shaders", utils: "Utilities" }[category];
  return <article className="page-entrance w-full min-w-0 px-6 py-10 sm:px-10 md:px-12 md:py-14 [&>*:not([data-slot=component-preview])]:mx-auto [&>*:not([data-slot=component-preview])]:w-full [&>*:not([data-slot=component-preview])]:max-w-4xl">
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hangry UI", item: siteUrl },
        { "@type": "ListItem", position: 2, name: categoryTitle, item: `${siteUrl}/${category}` },
        { "@type": "ListItem", position: 3, name: item.title, item: new URL(getRegistryItemHref(item), siteUrl).href },
      ],
    }} />
    <Content />
  </article>;
}
