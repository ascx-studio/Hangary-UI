import { notFound } from "next/navigation";
import { documentation } from "@/docs";
import { getRegistryItem, registryHomepage, type RegistryCategory } from "@/lib/registry";
import RegistryItemViewer from "./registry-item-viewer";
import { previewProps } from "./preview-props";

export default async function DetailPage({ name, category }: { name: string; category: RegistryCategory }) {
  const item = getRegistryItem(name, category);
  if (!item) notFound();
  const load = documentation[item.name as keyof typeof documentation];
  if (!load) notFound();
  const doc = await load();
  const Content = doc.default;
  const description = "description" in doc && typeof doc.description === "string" ? doc.description : item.description;
  const command = "installCommand" in doc && typeof doc.installCommand === "string" ? doc.installCommand : `npx shadcn@latest add ${registryHomepage.replace(/\/$/, "")}/r/${item.name}.json`;

  return (
    <div key={item.name} className="page-entrance w-full min-w-0">
      <div className="h-[calc(100dvh-3.25rem)] w-full min-w-0 md:h-dvh">
        <h1 className="sr-only">{item.title}</h1>
        <RegistryItemViewer title={item.title} name={item.name} registryUrl={registryHomepage} description={description} command={command}
            itemProps={previewProps[item.name] ?? []} documentation={<Content />} />
      </div>
    </div>
  );
}
