'use client';

import { Copy, Check,  Hash, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface BlogCodeProps {
  children: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function BlogCode({
  children,
  language = 'plaintext',
  title,
  showLineNumbers = true,
}: Readonly<BlogCodeProps>) {
  const [copied, setCopied] = useState(false);

  const highlightedCode = useMemo(() => {
    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(children, { language }).value;
      }
      return hljs.highlightAuto(children).value;
    } catch (error) {
      return children;
    }
  }, [children, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = children.split('\n');

  return (
    <div className="my-6 md:my-8 rounded-base overflow-hidden border border-border">
      <div className="flex items-center justify-between px-5 py-3 bg-muted/30 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-primary"></div>
            <div className="w-2 h-2 bg-zinc-500"></div>
            <div className="w-2 h-2 bg-zinc-700"></div>
          </div>
          {title ?? (
            <span className="meta-label text-foreground-muted flex items-center gap-2">
              {title ?? language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-3 py-1.5 meta-label transition-all duration-normal rounded-base
                ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-muted/50 hover:bg-muted text-foreground-muted hover:text-foreground border border-border hover:border-primary/30"}`}
          >
            {copied ? (
              <>
                <Check
                  size={14}
                  className="animate-in zoom-in duration-normal"
                />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden bg-background">
        <div className="text-[13px] md:text-sm font-mono leading-relaxed py-6 transition-opacity duration-slow">
          {showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="pr-4 text-foreground-muted select-none text-right w-12 font-mono">
                      {i + 1}
                    </td>
                    <td>
                      <code
                        className="text-foreground"
                        dangerouslySetInnerHTML={{
                          __html: highlightedCode.split("\n")[i] || line,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code
              className="px-6 block text-foreground"
              dangerouslySetInnerHTML={{
                __html: highlightedCode,
              }}
            />
          )}
        </div>


        <div
          className={`px-5 py-2 border-t  bg-black/5 flex justify-between items-center font-mono text-sm uppercase tracking-[0.2em] opacity-30`}
        >
          {" "}
          <div className="flex items-center gap-4 meta-label text-foreground-muted">
            <span className="flex items-center gap-1">
              <ChevronRight size={10} /> UTF-8
            </span>
            <span className="flex items-center gap-1">
              <Hash size={10} /> {lines.length} Lines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
