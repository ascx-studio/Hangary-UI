import Link from "next/link";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import { informationPages } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";

const page = informationPages.privacy;
export const metadata = pageMetadata("/privacy", page.title, page.description);

export default function PrivacyPage() {
  return (
    <div className="isolate flex min-h-dvh flex-col">
      <main className="relative z-10 min-h-dvh bg-background">
        <Container className="max-w-4xl py-16 sm:py-24">
          <Link href="/" className="mb-8 w-fit text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">← Hangry UI</Link>
          <h1 className={"typography-page-title"}>{page.title}</h1>
          <p className={`mt-6 typography-body`}>{page.description}</p>
          <div className="mt-12 space-y-10">
            {page.sections.map(section => (
              <section key={section.title}>
                <h2 className={"typography-section-title"}>{section.title}</h2>
                <p className={`mt-4 typography-body`}>{section.text}</p>
              </section>
            ))}
          </div>
          <nav aria-label="Related links" className="mt-12 flex flex-wrap gap-6 border-t border-border pt-8 text-sm">
            {page.links.map(link => <Link key={link.href} href={link.href} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{link.label}</Link>)}
          </nav>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
