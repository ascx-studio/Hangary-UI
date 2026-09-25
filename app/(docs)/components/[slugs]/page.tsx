import { notFound } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Card from '@/components/ui/Card'
import Logo from '@/components/ui/Logo'
import Container from '@/layout/Container'

const components = {
  button: {
    name: 'Button',
    description: 'Use buttons for clear actions and navigation.',
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

export function generateStaticParams() {
  return Object.keys(components).map((slugs) => ({ slugs }))
}

export default async function ComponentPage({
  params,
}: Readonly<{
  params: Promise<{ slugs: string }>
}>) {
  const { slugs } = await params
  const component = components[slugs as keyof typeof components]

  if (!component) {
    notFound()
  }

  return (
    <Container >

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
              {component.name}
            </li>
          </ol>
        </nav>

        <Card className="mx-auto mt-10 flex h-[60dvh] w-full items-center justify-center p-6 sm:p-10 md:p-16">
          {slugs === 'button' && (
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" href="/components/button" type="link">
                Primary action
              </Button>
              <Button variant="base" href="/components/button" type="link">
                Base
              </Button>
              <Button variant="secondary" href="/components/button" type="link">
                Secondary action
              </Button>
              <Button variant="accent" href="/components/button" type="link">
                Accent
              </Button>
              <Button variant="neutral" href="/components/button" type="link">
                Neutral
              </Button>
              <Button variant="info" href="/components/button" type="link">
                Info
              </Button>
              <Button variant="success" href="/components/button" type="link">
                Success
              </Button>
              <Button variant="warning" href="/components/button" type="link">
                Warning
              </Button>
              <Button variant="error" href="/components/button" type="link">
                Error
              </Button>
            </div>
          )}
          {slugs === 'icon' && (
            <div className="flex justify-center gap-6">
              <Icon name="component" size={32} />
              <Icon name="template" size={32} />
              <Icon name="utility" size={32} />
            </div>
          )}
          {slugs === 'logo' && (
            <div className="flex flex-wrap items-center justify-center gap-8">
              <Logo variant="logo" />
              <Logo variant="wordmark" />
            </div>
          )}
        </Card>
      </div>
    </Container>
  )
}
