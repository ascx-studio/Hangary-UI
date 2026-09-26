import type { Metadata } from 'next'
import CatalogPage from '@/components/registry/CatalogPage'
import CatalogGrid from '@/components/registry/CatalogGrid'

export const metadata: Metadata = { title: 'Templates | Lazy UI', description: 'Page compositions built with Lazy UI.' }

export default function TemplatesPage() {
  return <CatalogPage title="Templates" description="See how the pieces fit together. Explore page compositions and make them your own.">
    <section className="mt-10" aria-label="Template examples">
      <p className="text-sm text-muted-foreground">1 example · Full project installs are not available yet</p>
      <CatalogGrid category="templates" items={[{ name: 'portfolio', title: 'Portfolio', description: 'A personal introduction and selected work, composed from reusable components.', href: '/templates/portfolio', badge: 'Composition example', detail: 'Portfolio page' }]} />
    </section>
  </CatalogPage>
}
