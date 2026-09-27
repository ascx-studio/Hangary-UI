import DetailPage from "@/components/registry/detail-page";
import { getRegistryItem, getRegistryItems } from "@/lib/registry";

export function generateStaticParams() {
  return getRegistryItems("templates").map(item => ({ slug: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getRegistryItem(slug, "templates");
  return { title: item ? `${item.title} | Lazy UI` : "Registry item not found | Lazy UI", description: item?.description };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DetailPage name={slug} category="templates" />;
}
