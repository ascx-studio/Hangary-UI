"use client";

import { memo, useState, type ComponentType, type SVGProps } from "react";
import { BashDark, Bun, CSSNew, HTML5, JSON as JsonIcon, JavaScript, NPM, PnpmDark, Python, ReactDark, TypeScript, Yarn } from "@ridemountainpig/svgl-react";
import posthog from "posthog-js/full/no-external";
import { Check, Copy, FileCode } from "lucide-react";
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
import { toast } from "./toast-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

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
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--muted-foreground)", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "var(--muted-foreground)" } },
    { types: ["keyword", "tag", "selector", "atrule"], style: { color: "var(--primary)" } },
    { types: ["string", "char", "attr-value", "url"], style: { color: "var(--info)" } },
    { types: ["number", "boolean", "constant"], style: { color: "var(--warning)" } },
    { types: ["function", "class-name", "property", "attr-name"], style: { color: "var(--card-foreground)" } },
    { types: ["builtin", "important", "command"], style: { color: "var(--primary)" } },
  ],
};

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
      toast.success(commands ? "Install command copied" : displayedLanguage === "text" ? "Prompt copied" : "Code copied");
      if (isPostHogConfigured && posthog.has_opted_in_capturing()) {
        posthog.capture("code_copied", {
          content_type: commands ? "installation_command" : "source_code",
          language: displayedLanguage,
          package_manager: commands ? selectedManager : undefined,
          filename: filename || undefined,
        });
      }
    } catch {
      setCopyResult({ code: displayedCode, success: false });
      toast.error("Could not copy. Select the text and copy it manually.");
    }
  }

  const header = <CodeBlockHeader commands={Boolean(commands)} language={displayedLanguage} filename={filename} copied={currentResult?.success} onCopy={copyCode} />;
  const content = <CodeBlockRenderer code={displayedCode} language={displayedLanguage} filename={filename} showLineNumbers={showLineNumbers} packageManager={commands ? selectedManager : undefined} />;

  return (
    <div className={`lazy-code-block w-full min-w-0 bg-card text-card-foreground ${className}`}>
      {commands ? <Tabs value={selectedManager} onValueChange={value => {
        const next = value as keyof typeof managerIcons;
        setManager(next);
        onPackageManagerChange?.(next);
        if (isPostHogConfigured && posthog.has_opted_in_capturing()) {
          posthog.capture("package_manager_selected", { package_manager: next });
        }
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
  return (
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        {commands ? <PackageManagerTabs /> : <CodeLanguageLabel language={language} filename={filename} />}
        <button type="button" aria-label="Copy code" title={copied ? "Copied!" : "Copy code"} onClick={onCopy} className="inline-flex size-9 shrink-0 items-center justify-center hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}</button>
      </div>
  );
}

const CodeBlockRenderer = memo(function CodeBlockRenderer({ code, language, filename, showLineNumbers, packageManager }: { code: string; language: string; filename: string; showLineNumbers: boolean; packageManager?: string }) {
  const languageId = ({ js: "javascript", ts: "typescript", sh: "bash", shell: "bash", html: "markup", xml: "markup", py: "python" } as Record<string, string>)[language.toLowerCase()] ?? language.toLowerCase();
  return (
    <pre tabIndex={0} aria-label={filename ? `Code from ${filename}` : packageManager ? `${packageManager} installation command` : `${language || "Plain text"} code`} className="flex max-w-full gap-4 overflow-x-auto p-4 font-mono text-sm leading-6 focus-visible:outline-2 focus-visible:outline-ring">
      <Highlight prism={Prism} code={code} language={languageId} theme={prismTheme}>
        {({ tokens, getLineProps, getTokenProps }) => <code className="min-w-max">
          {tokens.map((line, index) => <div key={index} {...getLineProps({ line })} className="flex min-w-full">
            {showLineNumbers && <span aria-hidden="true" className="mr-4 shrink-0 select-none text-right text-muted-foreground">{index + 1}</span>}
            <span>{line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}</span>
          </div>)}
        </code>}
      </Highlight>
    </pre>
  );
});

const PackageManagerTabs = memo(function PackageManagerTabs() {
  return (
    <TabsList aria-label="Package manager">
          {(["bun", "npm", "pnpm", "yarn"] as const).map(option => {
            const ManagerIcon = managerIcons[option];
            return <TabsTrigger key={option} value={option}><ManagerIcon width={16} height={16} aria-hidden="true" focusable="false" className="shrink-0" />{option}</TabsTrigger>;
          })}
        </TabsList>
  );
});

const CodeLanguageLabel = memo(function CodeLanguageLabel({ language, filename }: { language: string; filename: string }) {
  const LanguageIcon = languageIcons[language.toLowerCase()] ?? FileCode;
  return (
    <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted-foreground"><LanguageIcon width={16} height={16} aria-hidden="true" focusable="false" className="shrink-0" /><span className="truncate">{filename || language || "Code"}</span></span>
  );
});
