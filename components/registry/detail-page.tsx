import { notFound } from "next/navigation";
import { documentation } from "@/docs";
import { getRegistryItem, registryHomepage, type RegistryCategory } from "@/lib/registry";
import Container from "@/components/layout/Container";
import PageEntrance from "@/components/PageEntrance";
import ComponentPreview from "./component-preview";
import ItemDetails from "./item-details";

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
    <PageEntrance key={item.name}>
      <Container className="p-4">
        <h1 className="sr-only">{item.title}</h1>
        <ItemDetails title={item.title} name={item.name} registryUrl={registryHomepage} description={description} command={command}
            files={item.files.map(file => file.target ?? file.path)} dependencies={item.dependencies ?? []}
            documentation={<Content />}>
          <ComponentPreview name={item.name} />
        </ItemDetails>
      </Container>
    </PageEntrance>
  );
}
