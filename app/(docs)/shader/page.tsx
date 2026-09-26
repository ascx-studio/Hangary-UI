import PageEntrance from "@/components/PageEntrance";
import Container from '@/layout/Container'
import Link from 'next/link'
import { getRegistryItems, getRegistryItemHref } from '@/lib/registry'

export const metadata = { title: 'Shaders | Lazy UI', description: 'Animated backgrounds and visual effects, ready to explore in a live preview.' }

export default function Page() {
  const items = getRegistryItems('shader')

  return (
    <PageEntrance>
      <Container className="p-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Shaders</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Animated backgrounds and visual effects, ready to explore in a live preview.</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <li key={item.name}>
              <Link href={getRegistryItemHref(item)} className="block h-full rounded-xl border border-border bg-card p-5 hover:border-primary/50">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </PageEntrance>
  )
}
