import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="page-entrance w-full min-w-0">
      <main className="relative isolate min-h-[90dvh] overflow-hidden">
        <Container className="flex min-h-[90dvh] max-w-7xl w-full flex-col justify-center py-12 sm:py-16 md:py-20">
          <div className="w-full max-w-2xl">
            <div className="w-full space-y-7">
              <Image
                src="/wordmark.png"
                alt="Hangry UI wordmark"
                width={400}
                height={78}
                priority
                className="h-auto w-[min(100%,28rem)] drop-shadow-2xl"
                style={{ height: "auto" }}
              />
              <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                Explore React components, page blocks, shaders, and utility
                code built with Tailwind CSS. Browse the source and make it your own.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/components" className="inline-flex min-h-11 items-center justify-center rounded-md border-2 border-primary bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  View Components
                </Link>
                <Link
                  href="https://github.com/ascx-studio/ui"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border-2 border-border bg-card px-5 py-2 text-sm font-semibold text-card-foreground shadow-sm transition-colors hover:bg-card/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Star on GitHub
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
