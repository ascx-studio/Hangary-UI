import type { Metadata } from 'next'
import CatalogPage from '@/components/registry/CatalogPage'
import RegistryCatalog from '@/components/registry/RegistryCatalog'

export const metadata: Metadata = { title: 'Blocks | Lazy UI', description: 'Complete sections for your next page. Explore their previews and adapt the details to your project.' }

export default function Page() {
  return <CatalogPage title="Blocks" description="Complete sections for your next page. Explore their previews and adapt the details to your project."><RegistryCatalog category="blocks" /></CatalogPage>
}
