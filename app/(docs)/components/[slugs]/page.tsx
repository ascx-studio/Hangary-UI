import DetailPage from "@/components/registry/detail-page";
import { getRegistryItem, getRegistryItems } from "@/lib/registry";

export function generateStaticParams() {
  return getRegistryItems("components").map(item => ({ slugs: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params;
  const item = getRegistryItem(slugs, "components");
  return { title: item ? `${item.title} | Lazy UI` : "Registry item not found | Lazy UI", description: item?.description };
}

export default async function Page({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params;
  return <DetailPage name={slugs} category="components" />;
}
