"use client";

import { useState } from "react";
import { Check, Copy, FileCode } from "lucide-react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import "./code-block.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("python", python);

interface CodeBlockProps {
  code?: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  commands?: Record<"bun" | "npm" | "pnpm", string>;
  packageManager?: "bun" | "npm" | "pnpm";
  onPackageManagerChange?: (manager: "bun" | "npm" | "pnpm") => void;
  className?: string;
}

export function CodeBlock({ code = 'const greeting = "Hello, world!";\nconsole.log(greeting);', language = "javascript", filename = "", showLineNumbers = false, commands, packageManager, onPackageManagerChange, className = "" }: CodeBlockProps = {}) {
  const [manager, setManager] = useState<"bun" | "npm" | "pnpm">("bun");
  const selectedManager = packageManager ?? manager;
  const displayedCode = commands ? commands[selectedManager] : code;
  const displayedLanguage = commands ? "bash" : language;
  const [copyResult, setCopyResult] = useState<{ code: string; success: boolean }>();
  const currentResult = copyResult?.code === displayedCode ? copyResult : undefined;
  const highlighted = hljs.getLanguage(displayedLanguage)
    ? hljs.highlight(displayedCode, { language: displayedLanguage, ignoreIllegals: true }).value : undefined;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(displayedCode);
      setCopyResult({ code: displayedCode, success: true });
    } catch {
      setCopyResult({ code: displayedCode, success: false });
    }
  }

  return (
    <div className={`lazy-code-block w-full min-w-0 border border-border bg-card text-card-foreground ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        {commands ? <div role="group" aria-label="Package manager" className="flex flex-wrap gap-1">
          {(["bun", "npm", "pnpm"] as const).map(option => <button key={option} type="button" aria-pressed={selectedManager === option} onClick={() => { setManager(option); onPackageManagerChange?.(option); }} className="min-h-9 px-3 text-xs font-medium text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-muted aria-pressed:text-foreground">{option}</button>)}
        </div> : <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted-foreground"><FileCode size={15} aria-hidden="true" className="shrink-0" /><span className="truncate">{filename || language || "Code"}</span></span>}
        <button type="button" aria-label="Copy code" title={currentResult?.success ? "Copied!" : "Copy code"} onClick={copyCode} className="inline-flex size-9 shrink-0 items-center justify-center hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{currentResult?.success ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}</button>
      </div>
      <pre tabIndex={0} aria-label={filename ? `Code from ${filename}` : commands ? `${selectedManager} installation command` : `${language || "Plain text"} code`} className="flex max-w-full gap-4 overflow-x-auto p-4 font-mono text-sm leading-6 focus-visible:outline-2 focus-visible:outline-ring">
        {showLineNumbers && <span aria-hidden="true" className="select-none text-right text-muted-foreground">{displayedCode.split("\n").map((_, index) => index + 1).join("\n")}</span>}
        {highlighted === undefined ? <code>{displayedCode}</code> : <code className={`hljs language-${displayedLanguage}`} dangerouslySetInnerHTML={{ __html: highlighted }} />}
      </pre>
      <span role="status" className={currentResult && !currentResult.success ? "block border-t border-border px-4 py-2 text-xs text-muted-foreground" : "sr-only"}>{currentResult?.success ? "Code copied to clipboard." : currentResult ? "Could not copy. Select the code and copy it manually." : ""}</span>
    </div>
  );
}
