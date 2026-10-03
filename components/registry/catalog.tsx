import { getRegistryItemHref, getRegistryItems, type RegistryCategory, type RegistryItem } from "@/lib/registry";
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import sidebarData from "@/data/sidebar.json";

const categoryIcons: Record<RegistryCategory, IconName> = {
  components: "component",
  blocks: "template",
  shader: "shader",
  utils: "utility",
};

export default function Catalog({ category }: { category: RegistryCategory }) {
  const items = getRegistryItems(category);
  const sections: { title?: string; items: RegistryItem[] }[] = category === "blocks"
    ? [...new Set(sidebarData.categories.blocks.items.map(item => item.group))].map(title => ({
      title,
      items: sidebarData.categories.blocks.items.filter(item => item.group === title)
        .flatMap(entry => items.filter(item => item.name === entry.slug)),
    }))
    : [{ items }];

  return (
    <div className="mt-6 space-y-10">
      {sections.filter(section => section.items.length).map((section, index) => (
        <section key={section.title ?? index} aria-label={section.title}>
          {section.title && <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>}
          <ul className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map(item => (
              <li key={item.name} className="min-w-0">
                <Link href={getRegistryItemHref(item)} className="flex h-full flex-col border border-border bg-card p-5 hover:border-primary/50">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Icon name={categoryIcons[category]} size={20} className="shrink-0" />
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
