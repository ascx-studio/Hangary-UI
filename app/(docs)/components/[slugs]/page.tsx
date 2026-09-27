import PageEntrance from "@/components/PageEntrance";
import { notFound } from 'next/navigation'
// import { documentation } from '@/docs'
import Container from '@/layout/Container'
import Link from 'next/link'
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


  return (
    <PageEntrance >
      <Container className="p-4">
        <article className="min-w-0 w-full">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link className="hover:text-foreground" href="/components">Components</Link></li>
              <li aria-hidden="true">/</li>
              {/* <li aria-current="page" className="text-foreground">{item.title}</li> */}
            </ol>
          </nav>
          <header className="my-5 md:my-6">
            {/* <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{item.title}</h1> */}
            {/* <p className="mt-2 max-w-3xl text-base leading-7 text-muted-foreground">{item.description}</p> */}
          </header>

        </article>
      </Container>
    </PageEntrance>
  )
}
