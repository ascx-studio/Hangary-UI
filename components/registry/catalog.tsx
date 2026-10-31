import { AspectRatio } from "@/hangry/components/aspect-ratio";
import { getRegistryItemHref, getRegistryItems, type RegistryCategory } from "@/lib/registry";
import { usesVgpu } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import SharedPreviewLayout from "@/components/registry/shared-preview-layout";
import { TabsContent, TabsList, TabsTrigger } from "@/hangry/components/tabs";
import { Suspense } from "react";
import { CatalogTabs } from "./catalog-tabs";
import sidebarData from "@/data/sidebar.json";

export default function Catalog({ category }: Readonly<{ category: RegistryCategory }>) {
  const items = getRegistryItems(category).filter((item) => !item.meta?.documentationPage);
  const componentItems = new Map(items.map((item) => [item.name, item]));
  const sidebarCategory = sidebarData.categories[category as keyof typeof sidebarData.categories];
  const groups = sidebarCategory
    ? [...new Set(sidebarCategory.items.flatMap((item) => (item.group ? [item.group] : [])))]
        .map((title) => ({
          title,
          items: sidebarCategory.items
            .filter((item) => item.group === title)
            .flatMap((item) => {
              const registryItem = componentItems.get(item.slug);
              return registryItem ? [registryItem] : [];
            }),
        }))
        .filter((group) => group.items.length)
    : [{ title: "", items }];

  const renderGroup = (group: (typeof groups)[number]) => (
    <section
      key={group.title || "all"}
      className="mt-12 first:mt-0"
      aria-label={group.title || category}
    >
      <ul className="mt-6 grid items-stretch gap-x-0 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item, index) => (
          <li
            key={item.name}
            className={`min-w-0 ${index % 2 === 1 ? "sm:border-l sm:border-border sm:pl-6" : "sm:pr-6"} ${index % 3 === 0 ? "lg:border-l-0 lg:pl-0 lg:pr-8" : index % 3 === 1 ? "lg:border-l lg:border-border lg:pl-8 lg:pr-8" : "lg:border-l lg:border-border lg:pl-8 lg:pr-0"}`}
          >
            <Link href={getRegistryItemHref(item)} className="flex h-full flex-col">
              <SharedPreviewLayout
                className="opacity-100! pointer-events-auto!"
                layoutId={
                  category === "components" ? `catalog-preview-${category}-${item.name}` : undefined
                }
              >
                <AspectRatio
                  ratio={16 / 9}
                  className="overflow-hidden rounded-lg border border-border bg-background"
                >
                  <Image
                    src={`/previews/${item.name}.png`}
                    alt={`${item.title} ${category === "shader" && usesVgpu(item) ? "vgpu WebGPU shader" : "React component"} preview`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`h-full w-full object-cover ${category === "shader" ? "hidden dark:block" : ""}`}
                  />
                  {category === "shader" && (
                    <Image
                      src={`/previews/light/${item.name}.png`}
                      alt={`${item.title} light mode preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover dark:hidden"
                    />
                  )}
                </AspectRatio>
              </SharedPreviewLayout>
              <h3 className={`mt-5 typography-section-title`}>{item.title}</h3>
              {category === "shader" && (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {usesVgpu(item) ? "vgpu · React · WebGPU" : "React · CSS / SVG"}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );

  const filters = [{ title: "All", items }, ...groups];
  return (
    <Suspense>
      <CatalogTabs filters={filters.map((group) => group.title)}>
        <div className="w-fit max-w-full overflow-x-auto">
          <TabsList aria-label={`Filter ${category} by category`}>
            {filters.map((group) => (
              <TabsTrigger key={group.title} value={group.title}>
                {group.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {filters.map((group) => (
          <TabsContent key={group.title} value={group.title}>
            {renderGroup(group)}
          </TabsContent>
        ))}
      </CatalogTabs>
    </Suspense>
  );
}
