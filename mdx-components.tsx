import { isValidElement, type ComponentProps } from "react";
import { CodeBlock } from "@/registry/components/code-block";
import { Card } from "@/registry/components/card";
import type { MDXComponents } from "mdx/types";
import ComponentPreview from "@/components/registry/component-preview";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export const mdxComponents = {
  ComponentPreview,
  CodeBlock,
  Card,
  Image: ({
    src,
    className,
    width,
    height,
    alt,
    ...props
  }: React.ComponentProps<typeof Image>) => (
    <Image
      className={cn("border", className)}
      src={src}
      width={width}
      height={height}
      alt={alt || ""}
      {...props}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "bg-surface text-surface-foreground hover:bg-surface/80 flex w-full flex-col items-center p-6 transition-colors sm:p-10",
        className,
      )}
      {...props}
    />
  ),
  Step: ({ className, children, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-6 scroll-m-32 font-heading text-lg font-medium tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  ),
  Steps: ({ ...props }: React.ComponentProps<"div">) => (
    <div
      className="steps [counter-reset:step] md:ml-4 md:border-l md:pl-8 [&>h3]:step"
      {...props}
    />
  ),
  a: ({ className, children, ...props }: React.ComponentProps<"a">) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code className={cn("bg-muted px-1.5 py-0.5 font-mono text-sm", className)} {...props} />
  ),
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => (
    <figure className={cn(className)} {...props} />
  ),
  h1: (props) => <h1 {...props} className="mb-8 text-4xl font-semibold tracking-tight sm:text-5xl" />,
  h2: (props) => <h2 {...props} className="mb-4 mt-10 text-2xl font-semibold tracking-tight" />,
  h3: (props) => <h3 {...props} className="mb-3 mt-8 text-xl font-semibold" />,
  h4: ({ className, children, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={cn(
        "font-heading mt-6 scroll-m-28 text-base font-medium tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ className, children, ...props }: React.ComponentProps<"h5">) => (
    <h5
      className={cn(
        "mt-6 scroll-m-28 text-base font-medium tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ className, children, ...props }: React.ComponentProps<"h6">) => (
    <h6
      className={cn(
        "mt-6 scroll-m-28 text-base font-medium tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h6>
  ),
  hr: ({ ...props }: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("", className)} alt={alt} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("mt-1", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol className={cn("my-4 ml-6 list-decimal", className)} {...props} />
  ),
  p: (props) => <p {...props} className="my-4 leading-7 text-muted-foreground" />,
  pre: ({ children, ...props }: ComponentProps<"pre">) => {
    if (isValidElement<ComponentProps<"code">>(children) && typeof children.props.children === "string") {
      const language = /(?:^|\s)language-([^\s]+)/.exec(children.props.className ?? "")?.[1];
      return <CodeBlock code={children.props.children.replace(/\n$/, "")} language={language} className={props.className} />;
    }
    return <pre {...props}>{children}</pre>;
  },
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-medium", className)} {...props} />
  ),
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="my-4 no-scrollbar w-full overflow-y-auto border">
      <table
        className={cn(
          "relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0",
          className,
        )}
        {...props}
      />
    </div>
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn(
        "px-4 py-2 text-left whitespace-nowrap [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr className={cn("m-0 border-b", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("my-4 ml-6 list-disc", className)} {...props} />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
