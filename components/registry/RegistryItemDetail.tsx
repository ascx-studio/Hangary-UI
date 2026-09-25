import Link from 'next/link'
import Container from '@/layout/Container'
import { getRegistryItem, getRegistryItemStatus, getRegistrySourceFiles, registryHomepage } from '@/lib/registry'

type Item = NonNullable<ReturnType<typeof getRegistryItem>>
type Category = 'components' | 'blocks' | 'shader' | 'utils'

const labels: Record<Category, string> = {
  components: 'Components', blocks: 'Blocks', shader: 'Backgrounds', utils: 'Utilities',
}

export default async function RegistryItemDetail({ item, category, embedded = false, usage, usageNotes }: {
  item: Item
  category: Category
  embedded?: boolean
  usage?: string
  usageNotes?: string
}) {
  const files = await getRegistrySourceFiles(item)
  const ready = getRegistryItemStatus(item) === 'ready'
  const entry = files[0]
  const content = (
    <div className="my-10 min-w-0 space-y-10">
      {!embedded && (
        <header>
          <Link href={`/${category}`} className="text-sm text-muted-foreground hover:text-foreground">← {labels[category]}</Link>
          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">{item.title ?? item.name}</h1>
          <p className="mt-3 text-muted-foreground">{item.description}</p>
        </header>
      )}
      <section className="space-y-4" aria-label="Installation">
        <h2 className="text-xl font-semibold">{ready ? 'Installation' : 'Source available'}</h2>
        {ready ? (
          <>
            <p className="text-muted-foreground">A generated registry file is available locally. After deploying the registry to the URL below, run this in a project configured with shadcn and Tailwind CSS. For local testing, replace the hostname with your running development server.</p>
            <pre className="overflow-x-auto border border-border p-4 text-sm"><code>{`npx shadcn@latest add ${registryHomepage}/r/${item.name}.json`}</code></pre>
            <a href={`/r/${item.name}.json`} className="inline-block text-primary underline underline-offset-4">View registry JSON</a>
          </>
        ) : (
          <p className="text-muted-foreground">This entry is registered, but its installable JSON has not been generated yet. Review the source and setup notes below. To use it manually, copy the listed files to their target paths and install the dependencies.</p>
        )}
        {item.docs && <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{item.docs}</p>}
      </section>
      {usage && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Usage</h2>
          <pre className="overflow-x-auto border border-border p-4 text-sm"><code>{usage}</code></pre>
          {usageNotes && <p className="text-sm leading-6 text-muted-foreground">{usageNotes}</p>}
        </section>
      )}
      {entry && !usage && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Entry file</h2>
          <p className="break-all font-mono text-sm">{entry.target ?? entry.path}</p>
          <p className="text-sm leading-6 text-muted-foreground">Import the exports from this file after installation or copying. The source below shows the available exports and props. Target aliases follow your project’s shadcn configuration; paths beginning with ~/ are relative to your project root.</p>
        </section>
      )}
      {Boolean(item.dependencies?.length) && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Dependencies</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {item.dependencies?.map((dependency) => <li key={dependency}><code>{dependency}</code></li>)}
          </ul>
        </section>
      )}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Source files <span className="text-muted-foreground">({files.length})</span></h2>
        <div className="divide-y divide-border border-y border-border">
          {files.map((file) => (
            <details key={file.path} className="py-4">
              <summary className="cursor-pointer break-all text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">{file.path}</summary>
              <p className="mt-3 break-all text-xs text-muted-foreground">{file.type}{file.target ? ` · Target: ${file.target}` : ''}</p>
              {file.content.length > 100_000 || /data:image\/[^;]+;base64,/.test(file.content) ? (
                <p className="mt-4 text-sm text-muted-foreground">This supporting file contains a large asset or embedded image. Open the listed source file in the repository to inspect or replace it.</p>
              ) : (
                <pre className="mt-4 max-h-[32rem] overflow-auto border border-border p-4 text-xs leading-6" tabIndex={0} aria-label={`Source code for ${file.path}`}><code>{file.content}</code></pre>
              )}
            </details>
          ))}
        </div>
      </section>
    </div>
  )

  return embedded ? content : <Container><article className="w-full max-w-5xl">{content}</article></Container>
}
