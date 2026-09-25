import { notFound } from 'next/navigation'
import RegistryItemDetail from '@/components/registry/RegistryItemDetail'
import { getRegistryItem, getRegistryItems } from '@/lib/registry'

const usage: Record<string, string> = {
  cn: 'import { cn } from "@/lib/cn"\n\ncn("px-4 text-foreground", active && "font-semibold", "px-6")',
  clamp: 'import { clamp } from "@/lib/clamp"\n\nclamp(120, 0, 100) // 100\nclamp(-5, 0, 100) // 0',
  'format-bytes': 'import { formatBytes } from "@/lib/format-bytes"\n\nformatBytes(1536) // "1.5 KiB"\nformatBytes(1048576, 2) // "1 MiB"',
}

const usageNotes: Record<string, string> = {
  cn: 'Accepts conditional classes and resolves conflicting Tailwind utilities. Later conflicting classes take precedence.',
  clamp: 'Bounds are inclusive. Non-finite inputs or a minimum greater than the maximum throw a RangeError.',
  'format-bytes': 'Uses binary units (1024 bytes per KiB). Precision defaults to one decimal place; pass an integer from 0 to 6. Trailing zeroes are removed. Negative or non-finite byte counts and invalid precision throw a RangeError.',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getRegistryItem(slug, 'utils')
  return { title: item ? `${item.title} | Lazy UI` : "Registry item not found | Lazy UI", description: item?.description }
}

export function generateStaticParams() {
  return getRegistryItems('utils').map((item) => ({ slug: item.name }))
}

export default async function RegistryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getRegistryItem(slug, 'utils')
  if (!item) notFound()
  return <RegistryItemDetail item={item} category="utils" usage={usage[slug]} usageNotes={usageNotes[slug]} />
}
