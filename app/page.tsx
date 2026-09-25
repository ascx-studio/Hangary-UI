import Container from '@/layout/Container';
import Button from '@/components/Button';
import Image from 'next/image';

export default function page() {
  return (
    <main className="relative isolate overflow-hidden">
      <Container className="flex min-h-[calc(100dvh-73px)] w-full items-center px-6 py-20 md:px-10 lg:py-28">
        <div className="w-full max-w-3xl">
          <Image
            src="/wordmark.png"
            alt="Hangry UI wordmark"
            width={400}
            height={100}
            className="h-auto w-[min(100%,25rem)]"
            priority
          />

          <p className="mt-5 max-w-xl text-lg  text-gray-400 hover:text-white transition-colors duration-200 font-light">
            Hangry UI is a collection of open-source, accessible, and
            customizable React components built with Tailwind CSS on top of
            shadcn/ui
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" href="/components" type="link">
              View Components
            </Button>
            <Button
              variant="secondary"
              type="link"
              href="https://github.com/razeevascx/lazy-ui"
            >
              Star on GitHub
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
