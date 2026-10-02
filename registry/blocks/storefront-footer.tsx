import { ArrowUpRight } from "lucide-react";
import { ViewTransition } from "react";

const groups = [
  { title: "Explore", links: ["New arrivals", "Best sellers", "Objects"] },
  { title: "Company", links: ["Our story", "Materials", "Journal"] },
  { title: "Help", links: ["Shipping", "Returns", "Contact"] },
];

export function StorefrontFooter({ brand = "COMMON GROUND", className = "" }: { brand?: string; className?: string }) {
  return <ViewTransition enter="morph-enter" exit="morph-exit" default="none"><footer className={`w-full bg-secondary px-6 py-9 text-secondary-foreground sm:px-10 sm:py-12 ${className}`}>
    <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]"><div><p className="font-serif text-xl tracking-wide">{brand}</p><p className="mt-3 max-w-xs text-sm leading-6 text-secondary-foreground/65">Everyday pieces, thoughtfully made. Objects that earn their place in your home.</p><a href="mailto:support@example.com" className="mt-5 inline-flex items-center gap-2 border-b border-secondary-foreground/35 pb-1 text-xs hover:border-secondary-foreground focus-visible:outline-2">Talk to our team <ArrowUpRight size={14} aria-hidden="true" /></a></div>
      {groups.map(group => <nav key={group.title} aria-label={`${group.title} links`}><h2 className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">{group.title}</h2><ul className="mt-4 space-y-3">{group.links.map((link, index) => <li key={link}><a href={`#${group.title.toLowerCase()}-${index}`} className="text-sm text-secondary-foreground/70 hover:text-secondary-foreground focus-visible:outline-2">{link}</a></li>)}</ul></nav>)}
    </div>
    <div className="mt-10 flex flex-col gap-3 border-t border-secondary-foreground/15 pt-4 font-mono text-[9px] uppercase tracking-wider text-secondary-foreground/50 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} {brand}</span><div className="flex gap-5"><a href="#privacy" className="hover:text-secondary-foreground">Privacy</a><a href="#terms" className="hover:text-secondary-foreground">Terms</a><a href="#accessibility" className="hover:text-secondary-foreground">Accessibility</a></div><a href="#top" className="hover:text-secondary-foreground">Back to top ↑</a></div>
  </footer></ViewTransition>;
}
