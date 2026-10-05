import DetailPage from "@/components/registry/detail-page";
import { getRegistryItem, getRegistryItems } from "@/lib/registry";

export function generateStaticParams() {
  return getRegistryItems("blocks").filter(item => !item.meta?.documentationPage).map(item => ({ slug: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getRegistryItem(slug, "blocks");
  return { title: item ? `${item.title} | Hangry UI` : "Registry item not found | Hangry UI", description: item?.description };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DetailPage name={slug} category="blocks" />;
}
