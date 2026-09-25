import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'
import Card from '@/components/ui/Card'
import Container from '@/layout/Container'

const components = [
  {
    slug: 'button',
    name: 'Button',
    description: 'Action controls for links and form submissions.',
    icon: 'component',
  },
  {
    slug: 'icon',
    name: 'Icon',
    description: 'Typed access to the public icon collection.',
    icon: 'utility',
  },
  {
    slug: 'logo',
    name: 'Logo',
    description: 'Responsive logo and wordmark variants.',
    icon: 'template',
  },
] satisfies ReadonlyArray<{
  slug: string
  name: string
  description: string
  icon: IconName
}>

export default function ComponentsPage() {
  return (
    <Container >
      <div className="max-w-3xl">

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Components made to compose.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Small, focused building blocks with sensible defaults and room for
          your own system.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {components.map((component) => (
          <Card
            key={component.slug}
            className="group transition-colors hover:border-primary"
          >
            <Link
              href={`/components/${component.slug}`}
              className="block p-6"
            >
              <Icon name={component.icon} size={24} />
              <h2 className="mt-8 text-xl font-medium text-card-foreground">
                {component.name}
              </h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                {component.description}
              </p>
            </Link>
          </Card>
        ))}
      </div>
    </Container>
  )
}
