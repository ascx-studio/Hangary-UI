import PageEntrance from "@/components/PageEntrance";
import Logo from '@/components/ui/Logo'
import Container from '@/layout/Container'
import Link from 'next/link'

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

const faqs = [
  {
    question: 'Do I need to pay to use Lazy UI?',
    answer: 'No. The library is free to use, and supporting the project is optional.',
  },
  {
    question: 'Can I contribute without writing code?',
    answer: 'Yes. Sharing the library, reporting bugs, improving documentation, and suggesting examples are all useful ways to help.',
  },
  {
    question: 'How do I report a bug or request a component?',
    answer: 'Open an issue in the GitHub repository. For bugs, include steps to reproduce the problem and your framework and browser versions. For component requests, describe what you want to build.',
  },
  {
    question: 'Where should I start with a code contribution?',
    answer: 'Check the existing issues for something you can help with. For larger changes, open an issue first to discuss the approach before starting work.',
  },
] as const

export default function SponsorPage() {
  return (
    <PageEntrance>
      <div className="min-h-dvh bg-background text-foreground">
        <main>
          <Container className="px-6 py-20 md:px-10 md:py-28">
            <div className="max-w-3xl">
              <Link
                href="/"
                aria-label="Lazy UI home"
                className="inline-block max-w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <Logo className="h-auto w-80 max-w-full" />
              </Link>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                Good tools grow through generous people.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Lazy UI is open source and free to use. A star, a contribution, or
                a thoughtful suggestion helps keep the collection moving.
              </p>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Contributions help improve the components, keep examples useful,
                and catch bugs in real projects. You can start small: tell us what
                worked, what was confusing, or what you would like to see next.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {supportOptions.map((option) => (
                <article
                  key={option.title}
                  className="flex flex-col border-t border-border py-6 md:pr-6"
                >
                  <h2 className="text-xl font-medium">
                    {option.title}
                  </h2>
                  <p className="mt-3 flex-1 leading-7 text-muted-foreground">
                    {option.description}
                  </p>
                  <Link
                    className="mt-6 self-start text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    href={option.href}
                  >
                    {option.label}
                  </Link>
                </article>
              ))}
            </div>

            <section aria-labelledby="faq-heading" className="mt-12 max-w-3xl border-t border-border pt-10">
              <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
                Frequently asked questions
              </h2>
              <div className="mt-8 divide-y divide-border">
                {faqs.map(({ question, answer }) => (
                  <details key={question} className="py-4">
                    <summary className="cursor-pointer font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                      {question}
                    </summary>
                    <p className="mt-3 leading-7 text-muted-foreground">{answer}</p>
                  </details>
                ))}
              </div>
              <p className="mt-8 text-sm text-muted-foreground">
                Have another question?{' '}
                <Link
                  href="https://github.com/razeevascx/lazy-ui/issues"
                  className="text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  Start a conversation on GitHub.
                </Link>
              </p>
            </section>
          </Container>
        </main>
      </div>
    </PageEntrance>
  )
}
