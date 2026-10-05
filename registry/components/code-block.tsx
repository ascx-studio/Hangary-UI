"use client";

import { useState, type ComponentType, type SVGProps } from "react";
import { BashDark, Bun, CSSNew, HTML5, JSON as JsonIcon, JavaScript, NPM, PnpmDark, Python, ReactDark, TypeScript, Yarn } from "@ridemountainpig/svgl-react";
import posthog from "posthog-js/full/no-external";
import { Check, Copy, FileCode } from "lucide-react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import "./code-block.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("bash", highlighter => {
  const grammar = bash(highlighter);
  return {
    ...grammar,
    contains: [
      { scope: "built_in", match: /\b(?:bun|bunx|npm|npx|pnpm|yarn)\b/ },
      { scope: "string", match: /https?:\/\/[^\s"'<>]+/ },
      ...(grammar.contains ?? []),
    ],
  };
});
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("python", python);

const managerIcons = { bun: Bun, npm: NPM, pnpm: PnpmDark, yarn: Yarn };
const languageIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  javascript: JavaScript, js: JavaScript,
  typescript: TypeScript, ts: TypeScript,
  jsx: ReactDark, tsx: ReactDark,
  bash: BashDark, sh: BashDark, shell: BashDark,
  css: CSSNew, html: HTML5, xml: HTML5,
  json: JsonIcon, python: Python, py: Python,
};

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

interface CodeBlockProps {
  code?: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  commands?: Record<"bun" | "npm" | "pnpm" | "yarn", string>;
  packageManager?: "bun" | "npm" | "pnpm" | "yarn";
  onPackageManagerChange?: (manager: "bun" | "npm" | "pnpm" | "yarn") => void;
  className?: string;
}

export function CodeBlock({ code = 'const greeting = "Hello, world!";\nconsole.log(greeting);', language = "javascript", filename = "", showLineNumbers = false, commands, packageManager, onPackageManagerChange, className = "" }: CodeBlockProps = {}) {
  const [manager, setManager] = useState<"bun" | "npm" | "pnpm" | "yarn">("bun");
  const selectedManager = packageManager ?? manager;
  const displayedCode = commands ? commands[selectedManager] : code;
  const displayedLanguage = commands ? "bash" : language;
  const [copyResult, setCopyResult] = useState<{ code: string; success: boolean }>();
  const currentResult = copyResult?.code === displayedCode ? copyResult : undefined;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(displayedCode);
      setCopyResult({ code: displayedCode, success: true });
      if (isPostHogConfigured) {
        posthog.capture("code_copied", {
          content_type: commands ? "installation_command" : "source_code",
          language: displayedLanguage,
          package_manager: commands ? selectedManager : undefined,
        });
      }
    } catch {
      setCopyResult({ code: displayedCode, success: false });
    }
  }

  const header = <CodeBlockHeader commands={Boolean(commands)} language={displayedLanguage} filename={filename} copied={currentResult?.success} onCopy={copyCode} />;
  const content = <CodeBlockContent code={displayedCode} language={displayedLanguage} filename={filename} showLineNumbers={showLineNumbers} packageManager={commands ? selectedManager : undefined} />;

  return (
    <div className={`lazy-code-block w-full min-w-0 border border-border bg-card text-card-foreground ${className}`}>
      {commands ? <Tabs value={selectedManager} onValueChange={value => {
        const next = value as keyof typeof managerIcons;
        setManager(next);
        onPackageManagerChange?.(next);
      }} className="gap-0">
        {header}
        {(["bun", "npm", "pnpm", "yarn"] as const).map(option => (
          <TabsContent key={option} value={option}>
            {selectedManager === option ? content : null}
          </TabsContent>
        ))}
      </Tabs> : <>{header}{content}</>}
      <span role="status" className={currentResult && !currentResult.success ? "block border-t border-border px-4 py-2 text-xs text-muted-foreground" : "sr-only"}>{currentResult?.success ? "Code copied to clipboard." : currentResult ? "Could not copy. Select the code and copy it manually." : ""}</span>
    </div>
  );
}

function CodeBlockHeader({ commands, language, filename, copied, onCopy }: { commands: boolean; language: string; filename: string; copied?: boolean; onCopy: () => void }) {
  const LanguageIcon = languageIcons[language.toLowerCase()] ?? FileCode;
  return (
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        {commands ? <TabsList aria-label="Package manager">
          {(["bun", "npm", "pnpm", "yarn"] as const).map(option => {
            const ManagerIcon = managerIcons[option];
            return <TabsTrigger key={option} value={option}><ManagerIcon width={16} height={16} aria-hidden="true" focusable="false" className="shrink-0" />{option}</TabsTrigger>;
          })}
        </TabsList> : <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted-foreground"><LanguageIcon width={16} height={16} aria-hidden="true" focusable="false" className="shrink-0" /><span className="truncate">{filename || language || "Code"}</span></span>}
        <button type="button" aria-label="Copy code" title={copied ? "Copied!" : "Copy code"} onClick={onCopy} className="inline-flex size-9 shrink-0 items-center justify-center hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}</button>
      </div>
  );
}

function CodeBlockContent({ code, language, filename, showLineNumbers, packageManager }: { code: string; language: string; filename: string; showLineNumbers: boolean; packageManager?: string }) {
  const highlighted = hljs.getLanguage(language)
    ? hljs.highlight(code, { language, ignoreIllegals: true }).value : undefined;
  return (
      <pre tabIndex={0} aria-label={filename ? `Code from ${filename}` : packageManager ? `${packageManager} installation command` : `${language || "Plain text"} code`} className="flex max-w-full gap-4 overflow-x-auto p-4 font-mono text-sm leading-6 focus-visible:outline-2 focus-visible:outline-ring">
        {showLineNumbers && <span aria-hidden="true" className="select-none text-right text-muted-foreground">{code.split("\n").map((_, index) => index + 1).join("\n")}</span>}
        {highlighted === undefined ? <code>{code}</code> : <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />}
      </pre>
  );
}
