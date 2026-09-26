import PageEntrance from "@/components/PageEntrance";
import Container from '@/layout/Container'
import Link from 'next/link'

export const metadata = { title: 'Templates | Lazy UI' }

export default function Page() {
  return (
    <PageEntrance>
      <Container className="p-4">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Templates</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Explore page compositions and make them your own.</p>
        <Link href="/templates/portfolio" className="mt-6 block rounded-xl border border-border bg-card p-5 hover:border-primary/50">
          <h2 className="font-semibold">Portfolio</h2>
          <p className="mt-2 text-sm text-muted-foreground">A personal introduction and selected work, composed from reusable components.</p>
        </Link>
      </Container>
    </PageEntrance>
  )
}
