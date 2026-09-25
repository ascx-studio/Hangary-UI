import Icon from '@/components/Icon'
import Container from '@/layout/Container'

export default function UtilsPage() {
  return (
    <Container >
      <h1 className="flex gap-4 mt-8 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
        <Icon name="utility" size={32} />
        Utility code
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
        Small helpers that keep repeated interface work clear and consistent.
      </p>
      <div className="mt-12 border border-slate-200 p-6 dark:border-white/10">
        <h2 className="text-xl font-medium text-slate-900 dark:text-white">
          cn
        </h2>
        <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">
          Merge conditional class names without losing Tailwind precedence.
        </p>
        <pre className="mt-6 overflow-x-auto bg-slate-950 p-5 text-sm leading-7 text-slate-200">
          <code>{`import { cn } from '@/utils/cn'

const classes = cn('px-4', isActive && 'bg-white')`}</code>
        </pre>
      </div>
    </Container>
  )
}
