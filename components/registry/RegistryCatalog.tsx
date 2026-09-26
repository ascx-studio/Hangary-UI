import CatalogGrid from './CatalogGrid'
import { getRegistryItems, getRegistryItemHref, getRegistryItemStatus, type RegistryCategory } from '@/lib/registry'

export default function RegistryCatalog({ category }: { category: RegistryCategory }) {
  const items = getRegistryItems(category)
  return <section className="mt-4" aria-label="Registry entries">
    <CatalogGrid category={category} items={items.map(item => ({
      name: item.name, title: item.title, description: item.description, href: getRegistryItemHref(item),
      badge: getRegistryItemStatus(item) === 'ready' ? 'Registry available' : 'Source only',
      detail: `${item.files.length} ${item.files.length === 1 ? 'file' : 'files'}`,
    }))} />
  </section>
}
