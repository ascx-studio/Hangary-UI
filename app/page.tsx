import PageEntrance from "@/components/PageEntrance";
import Container from "@/layout/Container";
import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <PageEntrance>
      <>
        <Container className="relative flex min-h-dvh max-w-7xl w-full flex-col items-center justify-center gap-12 py-4 md:flex-row md:justify-around">
          <div className="relative z-10 w-full max-w-xl md:mr-auto md:w-1/2">
            <div className="mt-8 w-full max-w-xl space-y-6 md:mt-0 md:pr-10">
              <Image
                src="/wordmark.png"
                alt="Hangry UI wordmark"
                width={400}
                height={100}
                priority
                className="h-auto w-[min(100%,25rem)] drop-shadow-2xl"
              />
              <p className="max-w-md text-lg leading-8 font-light text-muted-foreground transition-colors duration-200 hover:text-foreground">
                Explore React components, page blocks, backgrounds, and utility
                code built with Tailwind CSS. Browse the source and make it your own.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" href="/components" type="link">
                  View Components
                </Button>
                <Button
                  variant="neutral"
                  type="link"
                  href="https://github.com/razeevascx/lazy-ui"
                >
                  Star on GitHub
                </Button>
              </div>
              <nav aria-label="Browse the library" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                {[
                  { href: '/blocks', label: 'Blocks' },
                  { href: '/shader', label: 'Backgrounds' },
                  { href: '/utils', label: 'Utility code' },
                  { href: '/templates', label: 'Templates' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </Container>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-full bg-[url('/Background.png')] bg-contain bg-right bg-no-repeat bg-linear-to-r from-background to-background/20 opacity-5 md:block md:opacity-40"
        />
      </>
    </PageEntrance>
  );
}
