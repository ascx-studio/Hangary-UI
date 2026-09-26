import type { Metadata } from 'next'
import CatalogPage from '@/components/registry/CatalogPage'
import RegistryCatalog from '@/components/registry/RegistryCatalog'

export const metadata: Metadata = { title: 'Components | Lazy UI', description: 'Reusable interface pieces with previews, installation instructions, and source code.' }

export default function Page() {
  return <CatalogPage title="Components" description="Reusable interface pieces with previews, installation instructions, and source code."><RegistryCatalog category="components" /></CatalogPage>
}
