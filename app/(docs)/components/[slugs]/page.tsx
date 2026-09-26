import { notFound } from 'next/navigation'
import RegistryItemDetail from '@/components/registry/RegistryItemDetail'
import { getRegistryItem, getRegistryItems } from '@/lib/registry'

export function generateStaticParams() {
  return getRegistryItems('components').map(item => ({ slugs: item.name }))
}

export async function generateMetadata({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params
  const item = getRegistryItem(slugs, 'components')
  return { title: item ? `${item.title} | Lazy UI` : 'Component not found | Lazy UI', description: item?.description }
}

export default async function ComponentPage({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params
  const item = getRegistryItem(slugs, 'components')
  if (!item) notFound()
  return <RegistryItemDetail item={item} category="components" />
}
