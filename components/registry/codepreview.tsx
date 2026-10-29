import type { ComponentProps } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import { cn } from "@/lib/cn";
import styles from "./codepreview.module.css";

Prism.languages.insertBefore("bash", "function", {
  command: {
    pattern: /(^|\s)(?:bunx|bun|npx|npm|pnpm|yarn|shadcn(?:@[^\s]+)?)(?=\s|$)/,
    lookbehind: true,
  },
  url: /\bhttps?:\/\/[^\s"'<>]+/,
});

const prismTheme: PrismTheme = {
  plain: { color: "var(--card-foreground)", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--muted-foreground)", fontStyle: "italic" },
    },
    { types: ["punctuation", "operator"], style: { color: "var(--muted-foreground)" } },
    { types: ["keyword", "tag", "selector", "atrule"], style: { color: "var(--code-primary)" } },
    { types: ["string", "char", "attr-value", "url"], style: { color: "var(--code-info)" } },
    { types: ["number", "boolean", "constant"], style: { color: "var(--code-warning)" } },
    {
      types: ["function", "class-name", "property", "attr-name"],
      style: { color: "var(--card-foreground)" },
    },
    { types: ["builtin", "important", "command"], style: { color: "var(--code-primary)" } },
  ],
};

type CodePreviewProps = Omit<ComponentProps<"pre">, "children"> & {
  code: string;
  language?: string;
};

export default function CodePreview({
  code,
  language = "text",
  className,
  ...props
}: CodePreviewProps) {
  const normalized = language.toLowerCase();
  const languageId =
    (
      {
        js: "javascript",
        ts: "typescript",
        sh: "bash",
        shell: "bash",
        html: "markup",
        xml: "markup",
        py: "python",
      } as Record<string, string>
    )[normalized] ?? normalized;

  return (
    <div className={cn(styles.entrance, "min-w-0")}>
      <pre
        tabIndex={0}
        aria-label={`${language} code`}
        {...props}
        className={cn(
          styles.preview,
          "my-3 min-w-0 max-w-full overflow-x-auto border p-4 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          className,
        )}
      >
        <Highlight prism={Prism} code={code} language={languageId} theme={prismTheme}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <code className={`font-mono language-${normalized}`}>
              {tokens.map((line, index) => (
                <span key={index} {...getLineProps({ line })}>
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                  {index < tokens.length - 1 ? "\n" : null}
                </span>
              ))}
            </code>
          )}
        </Highlight>
      </pre>
    </div>
  );
}
