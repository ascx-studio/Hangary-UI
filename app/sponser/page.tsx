import Logo from '@/components/ui/Logo'
import Container from '@/components/layout/Container'
import Link from 'next/link'

const faqs = [
  {
    question: 'Do I need to pay to use Hangry UI?',
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
    <div className="page-entrance w-full min-w-0">
      <div className="min-h-dvh bg-background text-foreground">
        <main>
          <Container className="px-6 py-20 md:px-10 md:py-28">
            <div className="max-w-3xl">
              <Link
                href="/"
                aria-label="Hangry UI home"
                className="inline-block max-w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <Logo className="h-auto w-80 max-w-full" />
              </Link>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                Good tools grow through generous people.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Hangry UI is open source and free to use. Sponsorship, a star, or a
                contribution helps keep the collection moving.
              </p>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Contributions help improve the components, keep examples useful,
                and catch bugs in real projects. You can start small: tell us what
                worked, what was confusing, or what you would like to see next.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://github.com/sponsors/razeevascx"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center bg-emerald-400 px-5 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                >
                  Sponsor on GitHub
                </a>
                <a
                  href="https://github.com/ascx-studio/ui"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center bg-neutral-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                >
                  Star on GitHub
                </a>
              </div>
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
                  href="https://github.com/ascx-studio/ui/issues"
                  className="text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  Start a conversation on GitHub.
                </Link>
              </p>
            </section>
          </Container>
        </main>
      </div>
    </div>
  )
}
