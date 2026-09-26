import type { ComponentProps } from "react";
import * as motion from "motion/react-client";
import hljs from "highlight.js/lib/common";
import { cn } from "@/utils/cn";
import styles from "./codepreview.module.css";

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
  const grammar = normalized === "tsx" ? "typescript" : normalized === "jsx" ? "javascript" : normalized;
  const highlighted = hljs.getLanguage(grammar)
    ? hljs.highlight(code, { language: grammar, ignoreIllegals: true }).value
    : null;

  return (
    <motion.div
      className={cn(styles.entrance, "min-w-0")}
      initial={{ opacity: 0.6, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <pre
        tabIndex={0}
        aria-label={`${language} code`}
        {...props}
        className={cn(
          styles.preview,
          "my-3 min-w-0 max-w-full overflow-x-auto rounded-lg border p-4 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          className,
        )}
      >
        {highlighted === null ? (
          <code className="font-mono">{code}</code>
        ) : (
          <code
            className={`font-mono language-${normalized}`}
            // highlight.js escapes source text before adding its token markup.
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        )}
      </pre>
    </motion.div>
  );
}
