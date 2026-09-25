import Button from '@/components/Button'
import Card from '@/components/ui/Card'
import Icon from '@/components/Icon'
import Logo from '@/components/ui/Logo'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/registry/nova-blue/ui/alert'
import Badge from '@/registry/nova-blue/ui/badge'
import { Separator } from '@/registry/nova-blue/ui/separator'
import type { RegistryItem } from '@/lib/registry'
import type { ReactNode } from 'react'

type ComponentPreviewProps = {
  item?: RegistryItem
}

const previews = {
  button: () => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button href="/components" type="link" variant="link">
        Link Button
      </Button>
    </div>
  ),
  alert: () => (
    <div className="grid w-full max-w-2xl gap-4">
      <Alert>
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>Your settings are up to date.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>We couldn&apos;t save your changes. Please try again.</AlertDescription>
      </Alert>
    </div>
  ),
  separator: () => (
    <div className="grid w-full max-w-md gap-6">
      <div className="flex items-center gap-4">
        <span>Profile</span>
        <Separator />
        <span>Settings</span>
      </div>
      <div className="flex h-8 items-center justify-center">
        <Separator orientation="vertical" />
      </div>
    </div>
  ),
  card: () => (
    <Card className="w-full max-w-md p-6">
      <h3 className="text-xl font-semibold">Card title</h3>
      <p className="mt-2 text-sm text-muted-foreground">A reusable surface for grouping related content.</p>
      <Button className="mt-4">Action</Button>
    </Card>
  ),
  badge: () => (
    <div className="flex items-center gap-3 text-sm">
      <Badge />
      <span>Verified component</span>
    </div>
  ),
  icon: () => (
    <div className="flex items-center gap-6">
      <Icon name="component" size={32} alt="Component" />
      <Icon name="template" size={32} alt="Template" />
      <Icon name="utility" size={32} alt="Utility" />
    </div>
  ),
  logo: () => (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <Logo variant="logo" />
      <Logo variant="wordmark" />
    </div>
  ),
} satisfies Record<string, () => ReactNode>

export default function ComponentPreview({ item }: ComponentPreviewProps) {
  const preview = item?.meta?.preview
  return preview && preview in previews
    ? previews[preview]()
    : (
      <div className="w-full max-w-xl border border-border bg-background p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {item?.meta?.category ?? 'Registry item'}
          </span>
          <span className="text-xs text-muted-foreground">
            {item?.files.length ?? 0} {item?.files.length === 1 ? 'file' : 'files'}
          </span>
        </div>
        <h2 className="mt-4 text-xl font-semibold">
          {item?.title ?? item?.name ?? 'Registry preview'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {item?.description ?? 'Reusable interface building block from the registry.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {(item?.dependencies ?? []).slice(0, 4).map((dependency) => (
            <code key={dependency} className="border border-border px-2 py-1 text-xs text-muted-foreground">
              {dependency}
            </code>
          ))}
        </div>
      </div>
    )
}