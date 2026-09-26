import type { Metadata } from 'next'
import ItemPage from '@/components/registry/ItemPage'
import TemplatePreview from '@/components/registry/TemplatePreview'
import Content from '@/docs/templates/portfolio.mdx'
import { documentationComponents } from '@/components/registry/Documentation'

export const metadata: Metadata = { title: 'Portfolio example | Lazy UI', description: 'A portfolio page composed from Lazy UI components.' }

export default function Page() {
  return <ItemPage title="Portfolio" description="A clean portfolio page for your introduction, selected work, and next opportunity." category="templates" categoryLabel="Templates" badge="Composition example" preview={<TemplatePreview />}>
    <section id="documentation" className="scroll-m-24" aria-label="Documentation"><Content components={documentationComponents} /></section>
  </ItemPage>
}
