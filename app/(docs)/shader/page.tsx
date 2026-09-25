import Icon from '@/components/Icon'
import Card from '@/components/ui/Card'
import Container from '@/layout/Container'

export default function ShaderPage() {
  return (
    <Container>
      <h1 className="flex gap-4 mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        <Icon name="shader" size={32} />
          Shader experiments
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        A home for lightweight visual experiments that can add atmosphere and
        motion to an interface.
      </p>
      <Card className="mt-12 border-dashed p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Coming next
        </p>
        <p className="mt-3 text-muted-foreground">
          Shader examples will appear here as they are added to the library.
        </p>
      </Card>
    </Container>
  );
}
