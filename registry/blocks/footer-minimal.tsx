import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "cn";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import { Card } from "../components/card";

interface FooterProps extends ComponentProps<"footer"> {
  brand?: string;
  homeHref?: string;
  description?: string;
  groups?: {
    title: string;
    links: {
      label: string;
      href: string;
    }[];
  }[];
  githubHref?: string;
  copyright?: string;
  callout?: {
    title: string;
    description: string;
    label: string;
    href: string;
  };
  action?: ReactNode;
}

// Keep accepting the family prop without forwarding it to the DOM.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FooterMinimal({ brand = "Hangry UI", homeHref = "/", description: _description, groups = [{ title: "Explore", links: [{ label: "Components", href: "/components" }, { label: "Blocks", href: "/blocks" }] }, { title: "Resources", links: [{ label: "Button", href: "/components/button" }, { label: "Tabs", href: "/components/tabs" }, { label: "Table", href: "/components/table" }] }], githubHref = "https://github.com/ascx-studio/ui", copyright = `© ${new Date().getFullYear()} Hangry UI`, callout, action, className, children, ...props }: FooterProps = {}) {
  return (<footer {...props} data-slot="footer" data-layout="minimal" className={cn("w-full border border-border bg-background text-foreground", className)}>
    {callout && <div className="border-b border-border p-6 sm:p-8">
      <Card title={callout.title} description={callout.description} className="max-w-none!" footer={action ?? <a href={callout.href} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-ring">{callout.label}<ArrowUpRight size={16} aria-hidden="true" /></a>} />
    </div>}
    <div className={cn("gap-10 p-6 sm:p-8", "flex flex-wrap items-center justify-between")}>
      <div>
        <a href={homeHref} className="text-xl font-semibold focus-visible:outline-2 focus-visible:outline-ring">{brand}</a>

        {children}
      </div>
      <div className="flex flex-wrap gap-6">
        {groups.map(group => <nav key={group.title} aria-label={group.title}>

          <ul className="flex flex-wrap gap-4">
            {group.links.map(link => <li key={link.href}><a href={link.href} className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">{link.label}</a></li>)}
          </ul>
        </nav>)}
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4 text-xs text-muted-foreground sm:px-8">
      <span>{copyright}</span>
      {githubHref && <a href={githubHref} className="inline-flex min-h-9 items-center gap-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><GitHubDark width={16} height={16} aria-hidden="true" />GitHub</a>}
    </div>
  </footer>);
}
