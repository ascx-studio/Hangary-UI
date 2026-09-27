"use client";

export const seasonChapters = [
  { id: "01", name: "First light", time: "05:42", color: "#b7ddff", note: "The city wakes in a blue hush." },
  { id: "02", name: "High noon", time: "12:18", color: "#ffd18a", note: "A bright pause in the long day." },
  { id: "03", name: "Blue hour", time: "19:36", color: "#cbb4ff", note: "Everything softens at the edges." },
  { id: "04", name: "Deep night", time: "23:11", color: "#a9efd5", note: "The quiet has its own weather." },
];

export type SeasonChapter = typeof seasonChapters[number];

export function SeasonTimeline({ selected = "01", onSelect }: { selected?: string; onSelect?: (chapter: SeasonChapter) => void }) {
  const active = seasonChapters.find(chapter => chapter.id === selected) ?? seasonChapters[0];
  return <section aria-label="Daylight chapters" className="w-full border border-white/15 bg-[#111319]/90 p-5 text-white sm:p-7">
    <div className="flex items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-white/45">A day, in four acts</p><h2 className="mt-2 text-2xl font-light tracking-tight">Choose a moment</h2></div><span className="font-mono text-xs" style={{ color: active.color }}>{active.time}</span></div>
    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Select a time of day">{seasonChapters.map(chapter => <button key={chapter.id} type="button" aria-pressed={active.id === chapter.id} onClick={() => onSelect?.(chapter)} className="border px-3 py-3 text-left transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-pressed:bg-white/10" style={{ borderColor: active.id === chapter.id ? chapter.color : "#ffffff20" }}><span className="block font-mono text-[10px] text-white/40">{chapter.id} / {chapter.time}</span><span className="mt-2 block text-sm">{chapter.name}</span></button>)}</div>
    <p aria-live="polite" className="mt-5 border-l-2 pl-3 text-sm text-white/60" style={{ borderColor: active.color }}>{active.note}</p>
  </section>;
}
