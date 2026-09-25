import { notFound } from 'next/navigation'
import RegistryItemDetail from '@/components/registry/RegistryItemDetail'
import { getRegistryItem, getRegistryItems } from '@/lib/registry'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getRegistryItem(slug, 'shader')
  return { title: item ? `${item.title} | Lazy UI` : "Registry item not found | Lazy UI", description: item?.description }
}

export function generateStaticParams() {
  return getRegistryItems('shader').map((item) => ({ slug: item.name }))
}

export default async function RegistryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getRegistryItem(slug, 'shader')
  if (!item) notFound()
  return <RegistryItemDetail item={item} category="shader" />
}
