import type { ComponentProps } from "react";

interface BreadcrumbProps extends ComponentProps<"nav"> {
  items?: { label: string; href?: string }[];
}

export function Breadcrumb({ items = [{ label: "Home", href: "/" }, { label: "Components", href: "/components" }, { label: "Breadcrumb" }], className = "", ...props }: BreadcrumbProps = {}) {
  return <nav aria-label="Breadcrumb" className={`text-sm ${className}`} {...props}>
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => <li key={`${item.label}-${index}`} className="flex items-center gap-2">
        {index > 0 && <span aria-hidden="true" className="text-neutral-600">/</span>}
        {item.href && index < items.length - 1 ? <a href={item.href} className="text-neutral-400 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400">{item.label}</a> : <span aria-current={index === items.length - 1 ? "page" : undefined} className="text-white">{item.label}</span>}
      </li>)}
    </ol>
  </nav>;
}
