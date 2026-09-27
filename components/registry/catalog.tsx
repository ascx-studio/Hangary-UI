import { getRegistryItemHref, getRegistryItems, type RegistryCategory } from "@/lib/registry";
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";

const categoryIcons: Record<RegistryCategory, IconName> = {
  components: "component",
  blocks: "template",
  templates: "template",
  shader: "shader",
  utils: "utility",
};

export default function Catalog({ category }: { category: RegistryCategory }) {
  return (
    <ul className="mt-6 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {getRegistryItems(category).map(item => (
        <li key={item.name} className="min-w-0">
          <Link href={getRegistryItemHref(item)} className="block h-full rounded-xl border border-border bg-card p-5 hover:border-primary/50">
            <h2 className="flex items-center gap-2 font-semibold">
              <Icon name={categoryIcons[category]} size={20} className="shrink-0" />
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
