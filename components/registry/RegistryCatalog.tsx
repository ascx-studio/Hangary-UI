import Link from 'next/link'
import {
  getRegistryItems,
  getRegistryItemHref,
  getRegistryItemStatus,
  type RegistryCategory,
} from '@/lib/registry'

export default function RegistryCatalog({ category }: { category: RegistryCategory }) {
  const items = getRegistryItems(category)
  const hasSourceOnly = items.some((item) => getRegistryItemStatus(item) === 'source-only')

  return (
    <section className="mt-10" aria-label="Registry entries">
      <p className="text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? 'entry' : 'entries'}
      </p>
      {hasSourceOnly && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Entries marked “Source only” include code and setup notes. Their installable registry files have not been generated yet.
        </p>
      )}
      <ul className="mt-6 grid gap-x-8 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.name} className="min-w-0 border-t border-border">
            <Link
              href={getRegistryItemHref(item)}
              className="group block py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-medium text-foreground group-hover:text-primary">
                  {item.title || item.name}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {getRegistryItemStatus(item) === 'source-only' ? 'Source only' : 'Installable'}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {item.type === 'registry:hook' ? 'Hook · ' : ''}
                {item.files.length} {item.files.length === 1 ? 'file' : 'files'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
