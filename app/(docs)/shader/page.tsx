import Icon from '@/components/Icon'
import Container from '@/layout/Container'

export default function ShaderPage() {
  return (
    <Container>
      <h1 className="flex gap-4 mt-8 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
        <Icon name="shader" size={32} />
          Shader experiments
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
        A home for lightweight visual experiments that can add atmosphere and
        motion to an interface.
      </p>
      <div className="mt-12 border border-dashed border-slate-300 p-8 dark:border-white/20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Coming next
        </p>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Shader examples will appear here as they are added to the library.
        </p>
      </div>
    </Container>
  );
}
