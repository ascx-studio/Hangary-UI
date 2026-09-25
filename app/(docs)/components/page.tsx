import Link from 'next/link'
import Icon, { type IconName } from '@/components/Icon'
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

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
          Components made to compose.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">
          Small, focused building blocks with sensible defaults and room for
          your own system.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {components.map((component) => (
          <Link
            key={component.slug}
            href={`/components/${component.slug}`}
            className="group border border-slate-200 p-6 transition-colors hover:border-slate-400 dark:border-white/10 dark:hover:border-white/30"
          >
            <Icon name={component.icon} size={24} />
            <h2 className="mt-8 text-xl font-medium text-slate-900 dark:text-white">
              {component.name}
            </h2>
            <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
              {component.description}
            </p>
            <span className="mt-6 inline-block text-sm font-semibold text-slate-900 group-hover:underline dark:text-white">
              View component -&gt;
            </span>
          </Link>
        ))}
      </div>
    </Container>
  )
}
