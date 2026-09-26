import type { Metadata } from 'next'
import CatalogPage from '@/components/registry/CatalogPage'
import RegistryCatalog from '@/components/registry/RegistryCatalog'

export const metadata: Metadata = { title: 'Shaders | Lazy UI', description: 'Animated backgrounds and visual effects, ready to explore in a live preview.' }

export default function Page() {
  return <CatalogPage title="Shaders" description="Animated backgrounds and visual effects, ready to explore in a live preview."><RegistryCatalog category="shader" /></CatalogPage>
}
