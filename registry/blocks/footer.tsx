import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "cn";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import { Badge } from "../components/badge";
import { Card } from "../components/card";

interface FooterProps extends ComponentProps<"footer"> {
  brand?: string;
  homeHref?: string;
  description?: string;
  groups?: { title: string; links: { label: string; href: string }[] }[];
  githubHref?: string;
  copyright?: string;
  callout?: { title: string; description: string; label: string; href: string };
  action?: ReactNode;
}

function FooterLayout({ layout, brand = "Lazy UI", homeHref = "/", description = "Thoughtful components. Less setup. More time to build.", groups = [{ title: "Explore", links: [{ label: "Components", href: "/components" }, { label: "Blocks", href: "/blocks" }] }, { title: "Resources", links: [{ label: "Button", href: "/components/button" }, { label: "Tabs", href: "/components/tabs" }, { label: "Table", href: "/components/table" }] }], githubHref = "https://github.com/razeevascx/lazy-ui", copyright = `© ${new Date().getFullYear()} Lazy UI`, callout, action, className, children, ...props }: FooterProps & { layout: "columns" | "minimal" | "stacked" }) {
  return (
    <footer {...props} data-slot="footer" data-layout={layout} className={cn("w-full border border-border bg-background text-foreground", className)}>
      {callout && <div className="border-b border-border p-6 sm:p-8">
        <Card title={callout.title} description={callout.description} variant="secondary" className="max-w-none!" footer={action ?? <a href={callout.href} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-ring">{callout.label}<ArrowUpRight size={16} aria-hidden="true" /></a>} />
      </div>}
      <div className={cn("gap-10 p-6 sm:p-8", layout === "columns" ? "grid md:grid-cols-[1.5fr_2fr]" : layout === "minimal" ? "flex flex-wrap items-center justify-between" : "flex flex-col items-center text-center")}>
        <div>
          <a href={homeHref} className="text-xl font-semibold focus-visible:outline-2 focus-visible:outline-ring">{brand}</a>
          {layout !== "minimal" && <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>}
          {layout !== "minimal" && <div className="mt-4"><Badge variant="success">Open source</Badge></div>}
          {children}
        </div>
        <div className={cn(layout === "minimal" ? "flex flex-wrap gap-6" : "grid grid-cols-2 gap-8")}>
          {groups.map(group => <nav key={group.title} aria-label={group.title}>
            {layout !== "minimal" && <h3 className="mb-4 text-sm font-semibold">{group.title}</h3>}
            <ul className={layout === "minimal" ? "flex flex-wrap gap-4" : "space-y-3"}>
              {group.links.map(link => <li key={link.href}><a href={link.href} className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">{link.label}</a></li>)}
            </ul>
          </nav>)}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4 text-xs text-muted-foreground sm:px-8">
        <span>{copyright}</span>
        {githubHref && <a href={githubHref} className="inline-flex min-h-9 items-center gap-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><GitHubDark width={16} height={16} aria-hidden="true" />GitHub</a>}
      </div>
    </footer>
  );
}

export function Footer(props: FooterProps = {}) {
  return <FooterLayout {...props} layout="columns" />;
}

export function FooterMinimal(props: FooterProps = {}) {
  return <FooterLayout {...props} layout="minimal" />;
}

export function FooterStacked(props: FooterProps = {}) {
  return <FooterLayout {...props} layout="stacked" />;
}
