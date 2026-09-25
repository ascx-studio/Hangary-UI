import Link from 'next/link'
import Icon from '@/components/Icon'
import Container from '@/layout/Container'

const templates = [
  {
    name: 'Documentation shell',
    description: 'A focused starting point for product and component docs.',
    href: '/components',
  },
  {
    name: 'Landing page',
    description: 'A simple content-first page for introducing a project.',
    href: '/',
  },
] as const

export default function TemplatesPage() {
  return (
    <Container >
      <h1 className="flex gap-4 mt-8 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
        <Icon name="template" size={32} />
        Templates
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
        Practical page structures to help you move from a blank route to a
        useful interface.
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Link
            key={template.name}
            href={template.href}
            className="border border-slate-200 p-6 hover:border-slate-400 dark:border-white/10 dark:hover:border-white/30"
          >
            <h2 className="text-xl font-medium text-slate-900 dark:text-white">
              {template.name}
            </h2>
            <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
              {template.description}
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
