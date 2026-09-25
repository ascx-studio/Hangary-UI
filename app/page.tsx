import Container from "@/layout/Container";
import Button from "@/components/Button";
import Image from "next/image";

export default function Page() {
  return (
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
              Hangry UI is a collection of open-source, accessible, and
              customizable React components built with Tailwind CSS on top of
              shadcn/ui.
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
          </div>
        </div>
      </Container>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-full bg-[url('/Background.png')] bg-contain bg-right bg-no-repeat bg-linear-to-r from-background to-background/20 opacity-5 md:block md:opacity-40"
      />
    </>
  );
}
