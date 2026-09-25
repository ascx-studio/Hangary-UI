import { readFile } from 'node:fs/promises'
import path from 'node:path'
import registry from '@/registry.json'
import generatedRegistry from '@/public/r/registry.json'

export type RegistryCategory = 'components' | 'blocks' | 'shader' | 'utils'

export type RegistryFile = {
  path: string
  type: string
  target?: string
}

export type RegistryItem = {
  name: string
  title: string
  description: string
  type: string
  files: RegistryFile[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  docs?: string
  meta?: { category?: string; source?: string; collection?: string; preview?: string }
}

export const registryHomepage = registry.homepage
const items: RegistryItem[] = registry.items
const generatedNames = new Set(generatedRegistry.items.map((item) => item.name))
const categories: RegistryCategory[] = ['components', 'blocks', 'shader', 'utils']

export function getRegistryCategory(item: RegistryItem): RegistryCategory {
  if (categories.includes(item.meta?.category as RegistryCategory)) {
    return item.meta!.category as RegistryCategory
  }
  if (item.type === 'registry:block') return 'blocks'
  if (item.type === 'registry:lib' || item.type === 'registry:hook') return 'utils'
  if (item.files[0]?.path.includes('/background/')) return 'shader'
  return 'components'
}

export function getRegistryItems(category?: RegistryCategory): RegistryItem[] {
  return items
    .filter((item) => !category || getRegistryCategory(item) === category)
    .toSorted((a, b) => a.title.localeCompare(b.title) || a.name.localeCompare(b.name))
}

export function getRegistryItem(name: string, category?: RegistryCategory): RegistryItem | undefined {
  return items.find((item) => item.name === name && (!category || getRegistryCategory(item) === category))
}

export function getRegistryItemHref(item: RegistryItem): string {
  return `/${getRegistryCategory(item)}/${item.name}`
}

/** A generated artifact exists locally; this does not assert remote deployment. */
export function getRegistryItemStatus(item: RegistryItem): 'ready' | 'source-only' {
  return generatedNames.has(item.name) ? 'ready' : 'source-only'
}

export async function getRegistrySourceFiles(item: RegistryItem): Promise<Array<RegistryFile & { content: string }>> {
  const root = process.cwd()
  return Promise.all(item.files.map(async (file) => {
    const absolutePath = path.resolve(root, file.path)
    if (!absolutePath.startsWith(`${root}${path.sep}`)) {
      throw new Error(`Registry source must be inside the project: ${file.path}`)
    }
    return { ...file, content: await readFile(absolutePath, 'utf8') }
  }))
}
