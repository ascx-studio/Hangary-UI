import PageEntrance from "@/components/PageEntrance";
import { notFound } from 'next/navigation'
import { documentation } from '@/docs'
import Container from '@/layout/Container'
import Link from 'next/link'
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
  const loadContent = documentation[item.name as keyof typeof documentation]
  if (!loadContent) notFound()
  const { default: Content } = await loadContent()

  return (
    <PageEntrance key={item.name}>
      <Container className="py-6 md:py-8">
        <article className="min-w-0 w-full">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link className="hover:text-foreground" href="/shader">Shaders</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">{item.title}</li>
            </ol>
          </nav>
          <header className="my-5 md:my-6">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{item.title}</h1>
            <p className="mt-2 max-w-3xl text-base leading-7 text-muted-foreground">{item.description}</p>
          </header>
          <Content />
        </article>
      </Container>
    </PageEntrance>
  )
}
