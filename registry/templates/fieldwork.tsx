import { ListeningStation } from "../blocks/listening-station";

const notes = [
  { number: "01", title: "Follow the signal", text: "Start with a preset, then tune the dial. Every frequency reveals a different interference pattern." },
  { number: "02", title: "Take your time", text: "There is no destination here. Pause the field, study its contours, and stay a little longer." },
  { number: "03", title: "Make some space", text: "An experiment in slowing down. No playlist, no notifications. Just light, movement, and a moment to yourself." },
];

/** A complete visual-experiment landing page, composed from portable registry pieces. */
export function Fieldwork() {
  return (
    <div className="overflow-hidden  bg-[#e9ebdf] text-[#263125]">
      <nav aria-label="Fieldwork navigation" className="flex flex-wrap items-center justify-between gap-4 border-b border-[#263125]/20 px-6 py-5 sm:px-10">
        <a href="#fieldwork-home" className="text-lg font-semibold tracking-tight focus-visible:outline-2">Fieldwork®</a>
        <div className="flex gap-5 font-mono text-xs"><a href="#fieldwork-lab" className="underline-offset-4 hover:underline">The lab ↗</a><a href="#fieldwork-notes" className="underline-offset-4 hover:underline">Field notes ↗</a></div>
      </nav>
      <div id="fieldwork-home" className="px-6 py-14 sm:px-10 sm:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[.25em]">Independent experiments in digital stillness</p>
        <div className="mt-6 grid items-end gap-6 lg:grid-cols-[1.4fr_1fr]">
          <h1 className="max-w-2xl text-5xl font-light leading-[1.05] tracking-[-.05em] sm:text-7xl">Less noise.<br /><span className="text-[#68765b]">More wonder.</span></h1>
          <div className="max-w-sm"><p className="text-base leading-7 text-[#56614e]">A small corner of the internet for curiosity. Explore living patterns, find a frequency, and let the world wait.</p><a href="#fieldwork-lab" className="mt-6 inline-flex rounded-full bg-[#263125] px-5 py-3 text-sm text-[#e9ebdf] focus-visible:outline-2 focus-visible:outline-offset-4">Enter the signal lab ↗</a></div>
        </div>
      </div>
      <div id="fieldwork-lab" className="scroll-mt-6 px-3 sm:px-6"><ListeningStation /></div>
      <section id="fieldwork-notes" aria-label="Field notes" className="scroll-mt-6 px-6 py-14 sm:px-10">
        <h2 className="mb-8 font-mono text-xs uppercase tracking-[.2em]">A few field notes</h2>
        <div className="grid gap-8 md:grid-cols-3">{notes.map(note => <article key={note.number} className="border-t border-[#263125]/25 pt-5"><span className="font-mono text-xs text-[#68765b]">/{note.number}</span><h3 className="mb-3 mt-5 text-xl tracking-tight">{note.title}</h3><p className="text-sm leading-6 text-[#56614e]">{note.text}</p></article>)}</div>
      </section>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-[#263125]/20 px-6 py-5 font-mono text-[10px] uppercase tracking-widest sm:px-10"><span>Fieldwork — An ongoing exploration</span><span>Made for the curious.</span></footer>
    </div>
  );
}
