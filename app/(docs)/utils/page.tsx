import Icon from '@/components/Icon'
import Card from '@/components/ui/Card'
import Container from '@/layout/Container'

export default function UtilsPage() {
  return (
    <Container >
      <h1 className="flex gap-4 mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        <Icon name="utility" size={32} />
        Utility code
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-base-content/70">
        Small helpers that keep repeated interface work clear and consistent.
      </p>
      <Card className="mt-12 p-6">
        <h2 className="text-xl font-medium text-foreground">
          cn
        </h2>
        <p className="mt-2 leading-7 text-base-content/70">
          Merge conditional class names without losing Tailwind precedence.
        </p>
        <pre className="mt-6 overflow-x-auto bg-base-200 p-5 text-sm leading-7 text-base-content">
          <code>{`import { cn } from '@/utils/cn'

const classes = cn('px-4', isActive && 'bg-base-200')`}</code>
        </pre>
      </Card>
    </Container>
  )
}
