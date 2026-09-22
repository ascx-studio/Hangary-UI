import Container from '@/layout/Container';
import Button from '@/components/Button';

export default function page() {
  return (
    <Container className=" min-h-[90dvh]   overflow-hidden px-4 py-16  md:px-5">
      <h2 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
        Collection of components, blocks, sections and utilities made for reuse.
      </h2>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" href="/docs/components" type="link">
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
    </Container>
  );
}
