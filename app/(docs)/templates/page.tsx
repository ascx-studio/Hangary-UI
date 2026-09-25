import Link from 'next/link'
import Icon from '@/components/Icon'
import Card from '@/components/ui/Card'
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
      <h1 className="flex gap-4 mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        <Icon name="template" size={32} />
        Templates
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Practical page structures to help you move from a blank route to a
        useful interface.
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Link
            key={template.name}
            href={template.href}
            className="group block"
          >
            <Card className="p-6 transition-colors group-hover:border-primary">
              <h2 className="text-xl font-medium text-card-foreground">
                {template.name}
              </h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                {template.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
