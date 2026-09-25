import { notFound } from 'next/navigation'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
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
}: {
  params: Promise<{ slugs: string }>
}) {
  const { slugs } = await params
  const component = components[slugs as keyof typeof components]

  if (!component) {
    notFound()
  }

  return (
    <Container >

      <div className="mt-10 max-w-3xl">

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {component.name}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">
          {component.description}
        </p>

        <div className="mt-10 border border-slate-200 p-8 dark:border-white/10">
          {slugs === 'button' && (
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" href="/components/button" type="link">
                Primary action
              </Button>
              <Button variant="secondary" href="/components/button" type="link">
                Secondary action
              </Button>
            </div>
          )}
          {slugs === 'icon' && (
            <div className="flex gap-6">
              <Icon name="component" size={32} />
              <Icon name="template" size={32} />
              <Icon name="utility" size={32} />
            </div>
          )}
          {slugs === 'logo' && (
            <div className="flex flex-wrap items-center gap-8">
              <Logo variant="logo" />
              <Logo variant="wordmark" />
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
