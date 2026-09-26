import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'

export default function TemplatePreview() {
  return (
    <section aria-label="Portfolio page example" className="mt-10 overflow-hidden border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-6">
        <span className="font-semibold">Alex Morgan</span>
        <nav aria-label="Example portfolio"><Link href="#template-work" className="underline underline-offset-4">Selected work</Link></nav>
      </header>
      <div className="p-6 md:p-12">
        <p className="mb-6 text-sm text-muted-foreground">Designer & developer · Available for projects</p>
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Thoughtful design. Useful software.</h2>
        <p className="my-6 text-lg leading-8 text-muted-foreground">I create accessible digital experiences that help people do their best work.</p>
        <Button type="link" href="#template-work" variant="primary">Explore my work</Button>
        <div id="template-work" className="mt-12 scroll-m-24">
          <h3 className="mb-6 text-2xl font-semibold">Selected work</h3>
          <figure><Image src="/Sample.jpeg" alt="Sample project artwork" width={800} height={400} className="h-auto w-full rounded-xl" /><figcaption className="mt-4 text-sm text-muted-foreground">Studio journal — a home for ideas and experiments</figcaption></figure>
        </div>
      </div>
      <footer className="border-t border-border p-6 text-sm text-muted-foreground">A sample page composed from Lazy UI components.</footer>
    </section>
  )
}
