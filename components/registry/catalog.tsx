import { typography } from "@/registry/lib/typography.shared";
import { AspectRatio } from "@/registry/components/aspect-ratio";
import { getRegistryItemHref, getRegistryItems, type RegistryCategory } from "@/lib/registry";
import Image from "next/image";
import Link from "next/link";
import SharedPreviewLayout from "@/components/registry/shared-preview-layout";

export default function Catalog({ category }: Readonly<{ category: RegistryCategory }>) {
  const items = getRegistryItems(category).filter(item => !item.meta?.documentationPage);

  return (
    <ul className="mt-8 grid items-stretch gap-x-0 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li
          key={item.name}
          className={`min-w-0 ${index % 2 === 1 ? "sm:border-l sm:border-border sm:pl-6" : "sm:pr-6"} ${index % 3 === 0 ? "lg:border-l-0 lg:pl-0 lg:pr-8" : index % 3 === 1 ? "lg:border-l lg:border-border lg:pl-8 lg:pr-8" : "lg:border-l lg:border-border lg:pl-8 lg:pr-0"}`}
        >
          <Link href={getRegistryItemHref(item)} className="flex h-full flex-col">
            <SharedPreviewLayout layoutId={category === "components" ? `catalog-preview-${category}-${item.name}` : undefined}>
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border border-border bg-background">
                <Image
                  src={`/previews/${item.name}.png`}
                  alt={`${item.title} preview`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </SharedPreviewLayout>
            <h3 className={`mt-5 ${typography.sectionTitle}`}>{item.title}</h3>
            <p className={`mt-2 line-clamp-2 ${typography.body}`}>{item.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
