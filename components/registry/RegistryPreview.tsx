import type { RegistryItem } from '@/lib/registry'
import RegistryDemos from './RegistryDemos'
import ShaderPreview from './ShaderPreview'

export default function RegistryPreview({ item }: { item: RegistryItem }) {
  const path = item.files[0]?.path
  let preview
  if (item.meta?.category === 'shader') {
    preview = <ShaderPreview name={item.name} />
  } else if (item.name === 'portfolio-opengraph') {
    // The entry returns an ImageResponse, served by the preview route.
    // eslint-disable-next-line @next/next/no-img-element
    preview = <img src="/preview/opengraph" alt="Generated portfolio open graph image" width={1200} height={630} className="h-auto w-full rounded-xl border" />
  } else if (path) {
    preview = <RegistryDemos path={path} />
  } else {
    throw new Error(`Missing live preview for registry entry: ${item.name}`)
  }
  return <section aria-label="Live preview">{preview}</section>
}
