export function StudioHero({
  eyebrow = "Independent digital studio",
  title = "Make room for the remarkable.",
  description = "We partner with thoughtful teams to turn ambitious ideas into clear, useful digital experiences.",
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <section aria-labelledby="studio-hero-title" className={`relative isolate w-full overflow-hidden bg-[#111b18] px-6 py-7 text-[#f3f9e9] sm:px-10 lg:px-14 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_35%,#4e6b38_0%,transparent_33%),linear-gradient(120deg,#14221b,#111b18_60%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(#e6ffcf18_1px,transparent_1px),linear-gradient(90deg,#e6ffcf18_1px,transparent_1px)] [background-size:38px_38px]" />
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-5 font-mono text-[10px] font-semibold uppercase tracking-[.23em]">
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#d5ff55] shadow-[0_0_14px_#d5ff55]" />{eyebrow}</span>
        <span className="text-[#b7c9b6]">Ideas into impact ↗</span>
      </header>

      <div className="grid gap-12 py-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(16rem,.75fr)] lg:items-end lg:py-28">
        <div>
          <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[.3em] text-[#d5ff55]">Strategy · Design · Technology</p>
          <h1 id="studio-hero-title" className="max-w-4xl text-[clamp(3.5rem,8vw,7.75rem)] font-semibold leading-[.9] tracking-[-.075em]">{title}</h1>
        </div>
        <div className="max-w-sm lg:pb-3">
          <p className="text-base leading-7 text-[#c1d0bf] sm:text-lg">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex items-center gap-3 bg-[#d5ff55] px-5 py-3 text-sm font-semibold text-[#152017] transition-colors hover:bg-[#ecffac] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5ff55]">Explore our work <span aria-hidden="true">↗</span></a>
            <a href="#studio" className="inline-flex items-center border border-white/35 px-5 py-3 text-sm font-medium transition-colors hover:border-[#d5ff55] hover:text-[#d5ff55] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5ff55]">Meet the studio</a>
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-white/20 py-5 sm:grid-cols-3 sm:gap-8">
        <div><span className="block text-2xl font-semibold">01<span className="text-[#d5ff55]">.</span></span><span className="font-mono text-[10px] uppercase tracking-widest text-[#a9bca9]">Listen closely</span></div>
        <div><span className="block text-2xl font-semibold">02<span className="text-[#d5ff55]">.</span></span><span className="font-mono text-[10px] uppercase tracking-widest text-[#a9bca9]">Shape the idea</span></div>
        <div className="sm:text-right"><span className="block text-2xl font-semibold">03<span className="text-[#d5ff55]">.</span></span><span className="font-mono text-[10px] uppercase tracking-widest text-[#a9bca9]">Make it real</span></div>
      </div>
    </section>
  );
}
