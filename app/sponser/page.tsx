import Button from '@/components/Button'
import Card from '@/components/ui/Card'
import Logo from '@/components/ui/Logo';
import Container from '@/layout/Container'
import Link from 'next/link';

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
    <div className="min-h-screen ">
      <main>
        <Container className="px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-3xl">
            <Link
              href="/"
            >
              <Logo className="w-80 h-16" />
            </Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Good tools grow through generous people.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-base-content/70">
              Lazy UI is open source and free to use. A star, a contribution, or
              a thoughtful suggestion helps keep the collection moving.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {supportOptions.map((option) => (
              <Card
                key={option.title}
                className="flex min-h-56 flex-col p-6"
              >
                <h2 className="text-xl font-medium text-foreground">
                  {option.title}
                </h2>
                <p className="mt-3 flex-1 leading-7 text-base-content/70">
                  {option.description}
                </p>
                <Button variant="secondary" type="link" href={option.href}>
                  {option.label}
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}
