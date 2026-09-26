import RegistryPreview from './RegistryPreview'
import ItemPage from './ItemPage'
import { documentationComponents } from './Documentation'
import { documentation } from '@/docs'
import { getRegistryItemStatus, getRegistrySourceFiles, registryHomepage, type RegistryItem, type RegistryCategory } from '@/lib/registry'

const labels = { components: 'Components', blocks: 'Blocks', shader: 'Shaders', utils: 'Utilities' }

export default async function RegistryItemDetail({ item, category }: { item: RegistryItem; category: RegistryCategory }) {
  const files = await getRegistrySourceFiles(item)
  const ready = getRegistryItemStatus(item) === 'ready'
  const loadDocumentation = documentation[item.name as keyof typeof documentation]
  if (!loadDocumentation) throw new Error(`Missing documentation for ${item.name}`)
  const { default: Content } = await loadDocumentation()

  return (
    <ItemPage title={item.title} description={item.description} category={category} categoryLabel={labels[category]}
      badge={ready ? 'Registry available' : 'Source available'}
      preview={<RegistryPreview item={item} />}>
      <section aria-labelledby="installation" className="rounded-xl border border-border bg-muted/20 p-5 md:p-6">
        <h2 id="installation" className="text-xl font-semibold">Installation</h2>
        {ready ? <>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Run in a project configured with shadcn and Tailwind CSS. For an unpublished registry, replace the hostname with your local server.</p>
          <pre tabIndex={0} className="mt-4 overflow-x-auto rounded-lg border border-border bg-background p-4 text-sm"><code>{`npx shadcn@latest add ${registryHomepage}/r/${item.name}.json`}</code></pre>
          <a href={`/r/${item.name}.json`} className="mt-4 inline-block text-sm text-primary underline underline-offset-4">View registry JSON</a>
        </> : <p className="mt-3 text-sm leading-6 text-muted-foreground">Copy the source files to their target paths and install the dependencies listed below.</p>}
      </section>
      <section id="documentation" aria-label="Documentation" className="scroll-m-24">
        <Content components={documentationComponents} />
      </section>
      {!!item.dependencies?.length && <section>
        <h2 className="mb-4 text-xl font-semibold">Dependencies</h2>
        <ul className="flex flex-wrap gap-2">{item.dependencies.map(dependency => <li key={dependency} className="max-w-full break-all rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-xs">{dependency}</li>)}</ul>
      </section>}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Source files <span className="ml-2 text-sm font-normal text-muted-foreground">{files.length}</span></h2>
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {files.map(file => <details key={file.path} className="p-5">
            <summary className="cursor-pointer break-all text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">{file.path.split('/').at(-1)}</summary>
            <p className="mt-3 break-all text-xs text-muted-foreground">{file.target ?? file.path}</p>
            {file.content.length > 100_000 || /data:image\/[^;]+;base64,/.test(file.content)
              ? <p className="mt-4 text-sm text-muted-foreground">Open this asset in the repository to view the full file.</p>
              : <pre tabIndex={0} aria-label={`Source code for ${file.path}`} className="mt-4 max-h-96 overflow-auto rounded-lg bg-muted/30 p-4 text-xs leading-6"><code>{file.content}</code></pre>}
          </details>)}
        </div>
      </section>
    </ItemPage>
  )
}
