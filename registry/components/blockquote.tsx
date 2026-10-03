import type { ComponentProps } from "react";

interface BlockquoteProps extends ComponentProps<"figure"> {
  quote?: string;
  author?: string;
  source?: string;
}

export function Blockquote({ children, quote = "Simplicity is the ultimate sophistication.", author = "Design notes", source = "On making things that matter", className = "", ...props }: BlockquoteProps = {}) {
  return <figure className={`max-w-xl border-l-2 border-border py-2 pl-6 ${className}`} {...props}>
    <blockquote className="text-xl leading-relaxed text-white">{children ?? quote}</blockquote>
    {(author || source) && <figcaption className="mt-4 text-sm text-neutral-400">{author}{author && source && " — "}{source && <cite>{source}</cite>}</figcaption>}
  </figure>;
}
