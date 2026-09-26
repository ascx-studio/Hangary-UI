import type { MDXComponents } from 'mdx/types'

export const documentationComponents = {
  h2: ({ children, ...props }) => <h2 {...props} className="mt-10 mb-4 text-xl font-semibold tracking-tight first:mt-0">{children}</h2>,
  h3: ({ children, ...props }) => <h3 {...props} className="mt-6 mb-3 text-lg font-medium">{children}</h3>,
  p: (props) => <p {...props} className="my-4 text-sm leading-7 text-muted-foreground" />,
  pre: (props) => <pre {...props} tabIndex={0} className="my-5 overflow-x-auto rounded-xl border border-border bg-muted/30 p-5 text-sm leading-7 [&>code]:bg-transparent [&>code]:p-0" />,
} satisfies MDXComponents
