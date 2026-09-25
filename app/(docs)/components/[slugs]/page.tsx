import { getRegistryItem, getRegistryItems } from '@/lib/registry'
import RegistryItemDetail from '@/components/registry/RegistryItemDetail'
import ComponentPreview from '@/components/registry/ComponentPreview'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Container from '@/layout/Container'

const components = {
  badge: { name: 'Badge', description: 'Compact labels for status and categories.' },
  alert: { name: 'Alert', description: 'Display important messages with a title and description.' },
  separator: { name: 'Separator', description: 'Separate content horizontally or vertically.' },
  button: {
    name: 'Button',
    description: 'Use buttons for clear actions and navigation.',
  },
  card: {
    name: 'Card',
    description: 'Displays a card with border and shadow styling matching the Lazy UI theme.',
  },
  icon: {
    name: 'Icon',
    description: 'Use the shared icon set with a stable, typed API.',
  },
  logo: {
    name: 'Logo',
    description: 'Switch between the compact logo and full wordmark.',
  },
} as const

const usage: Record<string, string> = {
  button: `import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="flex gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="link" href="/docs">Link Button</Button>
    </div>
  )
}`,
  card: `import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <Card className="max-w-md p-6">
      <h3 className="text-xl font-semibold">Card Title</h3>
      <p className="mt-2 text-sm text-muted-foreground">Card content goes here.</p>
      <Button variant="primary" className="mt-4">Action</Button>
    </Card>
  )
}`,
  badge: `import { Badge } from "@/components/ui/badge"

<Badge variant="secondary">In progress</Badge>`,
  alert: `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

<Alert>
  <AlertTitle>Changes saved</AlertTitle>
  <AlertDescription>Your settings are up to date.</AlertDescription>
</Alert>`,
  separator: `import { Separator } from "@/components/ui/separator"

<Separator />

<div className="flex h-5 items-center gap-4">
  <span>Profile</span>
  <Separator orientation="vertical" />
  <span>Settings</span>
</div>`,
  icon: `import { Icon } from "@/components/ui/icon"

<Icon name="component" size={24} />`,
  logo: `import { Logo } from "@/components/ui/logo"

<Logo variant="wordmark" />`,
  'portfolio-badge': `import Badge from "@/components/lazy-ui/ui/portfolio/badge"

<Badge />`,
  'portfolio-verified-icon': `import { VerifiedIcon } from "@/components/lazy-ui/components/portfolio/verified-icon"

<VerifiedIcon className="size-6 text-primary" />`,
  'portfolio-icons': `import { ui, dbi, graphic, stack } from "@/components/lazy-ui/components/portfolio/icons"

<ui width={64} height={64} />`,
  'portfolio-copy-command': `import CopyCommand from "@/components/lazy-ui/ui/portfolio/copy-command"

<CopyCommand command="npx shadcn@latest add https://ui.rajeevpuri.com.np/r/button.json" />`,
  'portfolio-section-heading': `import SectionHeading from "@/components/lazy-ui/ui/portfolio/section-heading"

<SectionHeading>Featured Projects</SectionHeading>`,
  'portfolio-terminal-header': `import TerminalHeader from "@/components/lazy-ui/components/portfolio/terminal-header"

<TerminalHeader title="Terminal" />`,
  'portfolio-dotm-square-11': `import { DotmSquare11 } from "@/components/lazy-ui/ui/portfolio/dotm-square-11"

<DotmSquare11 className="size-16 text-primary" />`,
}

export async function generateMetadata({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params
  const item = getRegistryItem(slugs, 'components')
  const legacy = Object.hasOwn(components, slugs) ? components[slugs as keyof typeof components] : undefined
  const title = item?.title ?? legacy?.name
  return {
    title: title ? `${title} | Lazy UI` : 'Component not found | Lazy UI',
    description: item?.description ?? legacy?.description,
  }
}

export function generateStaticParams() {
  return [...new Set([...Object.keys(components), ...getRegistryItems('components').map((item) => item.name)])].map((slugs) => ({ slugs }))
}

export default async function ComponentPage({
  params,
}: Readonly<{
  params: Promise<{ slugs: string }>
}>) {
  const { slugs } = await params
  const legacy = Object.hasOwn(components, slugs) ? components[slugs as keyof typeof components] : undefined
  const item = getRegistryItem(slugs, 'components')

  if (!item && !legacy) {
    notFound()
  }

  const title = item?.title ?? legacy?.name ?? slugs
  const description = item?.description ?? legacy?.description

  return (
    <Container className="pb-16">
      <div className="mt-10 w-full max-w-5xl">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link className="transition-colors hover:text-foreground" href="/components">
                Components
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {title}
            </li>
          </ol>
        </nav>

        <h1 className="mt-8 text-4xl font-semibold">{title}</h1>
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}

        <section aria-label="Component preview" className="mt-8">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">Preview</span>
            <span className="font-mono text-[11px]">{slugs}</span>
          </div>
          <Card className="flex min-h-64 w-full items-center justify-center p-6 sm:p-10 md:p-12">
            <ComponentPreview item={item} />
          </Card>
        </section>

        {item && (
          <RegistryItemDetail
            item={item}
            category="components"
            embedded
            usage={usage[slugs]}
          />
        )}
      </div>
    </Container>
  )
}
