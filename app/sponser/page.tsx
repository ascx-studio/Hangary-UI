import Navbar from '@/components/Navbar'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Container from '@/layout/Container'

const supportOptions = [
  {
    title: 'Star the repository',
    description: 'Help more people discover the project and follow its progress.',
    href: 'https://github.com/razeevascx/lazy-ui',
    label: 'Open GitHub',
  },
  {
    title: 'Share the library',
    description: 'Pass Lazy UI along to someone who is building a new interface.',
    href: 'https://github.com/razeevascx/lazy-ui',
    label: 'View repository',
  },
  {
    title: 'Build with us',
    description: 'Suggest an improvement or contribute a useful component to the collection.',
    href: 'https://github.com/razeevascx/lazy-ui/issues',
    label: 'Open an issue',
  },
] as const

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Container className="px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-3xl">
            <Icon name="component" size={32} />
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Support Lazy UI
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-6xl">
              Good tools grow through generous people.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Lazy UI is open source and free to use. A star, a contribution,
              or a thoughtful suggestion helps keep the collection moving.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {supportOptions.map((option) => (
              <article
                key={option.title}
                className="flex min-h-56 flex-col border border-slate-200 p-6 dark:border-white/10"
              >
                <h2 className="text-xl font-medium text-slate-900 dark:text-white">
                  {option.title}
                </h2>
                <p className="mt-3 flex-1 leading-7 text-slate-600 dark:text-slate-400">
                  {option.description}
                </p>
                <Button
                  variant="secondary"
                  type="link"
                  href={option.href}
                >
                  {option.label}
                </Button>
              </article>
            ))}
          </div>
        </Container>
      </main>
    </div>
  )
}
