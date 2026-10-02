import { existsSync } from 'node:fs'
import path from 'node:path'
import registry from '@/registry.json'
import packageJson from '@/package.json'

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
const installedPackages = new Set(Object.keys(packageJson.dependencies))
const packageName = (dependency: string) => dependency.replace(/@[^@/]+$/, '')
const unavailablePaths = new Set(registry.items.filter(item =>
  item.dependencies?.some(dependency => !installedPackages.has(packageName(dependency)))
).map(item => item.files[0]?.path))
// Keep source entries intact; omit unavailable components from the documentation catalog.
const items: RegistryItem[] = registry.items.filter(item =>
  !unavailablePaths.has(item.files[0]?.path) && item.files.every(file => existsSync(path.resolve(process.cwd(), file.path)))
)
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
