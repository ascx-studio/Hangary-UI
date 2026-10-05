import { getRegistryItemHref, getRegistryItems, type RegistryCategory } from "@/lib/registry";
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";

const categoryIcons: Record<RegistryCategory, IconName> = {
  components: "component",
  blocks: "template",
  shader: "shader",
  utils: "utility",
};

export default function Catalog({ category }: { category: RegistryCategory }) {
  const items = getRegistryItems(category).filter(item => !item.meta?.documentationPage);

  return (
    <ul className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
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
  );
}
