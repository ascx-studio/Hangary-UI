import Container from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/seo/JsonLd";
import { siteDescription, siteUrl } from "@/lib/seo";

export default function Page() {
  return (
    <div className="page-entrance w-full min-w-0">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Hangry UI",
          url: siteUrl,
          description: siteDescription,
          inLanguage: "en-GB",
        }}
      />
        <Container className="min-h-dvh max-w-7xl w-full gap-12 py-12 sm:py-16 md:py-20">
          <Image
            src="/wordmark.svg"
            alt="Hangry UI wordmark"
            width={320}
            height={80}
            priority
            className="h-auto w-[min(100%,20rem)] drop-shadow-2xl"
            style={{ height: "auto" }}
          />
          <div className="flex w-full max-w-4xl flex-1 items-center text-left">
            <div className="w-full space-y-8">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
               Components, blocks and shaders made with motion
              </h1>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/components"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border-2 border-primary bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
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
    </div>
  );
}
