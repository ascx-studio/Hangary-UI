"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Share, TwitterIcon } from "lucide-react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";
import {
  ClaudeAI,
  GrokDark,
  OpenAIDark,
  XDark,

} from "@ridemountainpig/svgl-react";

const toastStyle = {
  background: "#18181b",
  color: "#fff",
  border: "1px solid #27272a",
  fontSize: "12px",
  fontFamily: "var(--font-mono)",
};

const MarkdownIcon = () => (
  <svg viewBox="0 0 208 128" className="size-4 fill-current" aria-hidden>
    <rect
      width="198"
      height="118"
      x="5"
      y="5"
      ry="10"
      stroke="currentColor"
      strokeWidth="10"
      fill="none"
    />
    <path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z" />
  </svg>
);

type DropdownItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

interface ShareButtonProps {
  pageContent?: string;
  pageUrl?: string;
}

export default function ShareButton({
  pageContent = "",
  pageUrl = globalThis.window === undefined ? "" : globalThis.location.href,
}: Readonly<ShareButtonProps>) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: document.title,
        text: pageContent,
        url: pageUrl,
      });
      setCopied(true);
      toast.success("Shared successfully!", { style: toastStyle });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  const llmsTxtUrl = `${pageUrl}/llms.txt`;
  const prompt = `Read ${llmsTxtUrl} so you have context on this page, then help me with it.`;
  const encodedPrompt = encodeURIComponent(prompt);

  const items: DropdownItem[] = [
    {
      label: "Share on X",
      icon: <XDark className="size-4" />,
      href:
          `https://x.com/intent/tweet?url=Hey check out this article: ${encodeURIComponent(pageUrl)}`
    },
    { label: "View as Markdown", icon: <MarkdownIcon />, href: llmsTxtUrl },
    {
      label: "Open in ChatGPT",
      icon: <OpenAIDark className="size-4" />,
      href: `https://chatgpt.com/?q=${encodedPrompt}`,
    },
    {
      label: "Open in Claude",
      icon: <ClaudeAI className="size-4" />,
      href: `https://claude.ai/new?q=${encodedPrompt}`,
    },
    {
      label: "Open in Grok",
      icon: <GrokDark className="size-4" />,
      href: `https://grok.com/?q=${encodedPrompt}`,
    },
  ];

  return (
    <div ref={ref} className="relative inline-flex items-center font-mono">
      <motion.button
        onClick={handleShare}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 h-9 pl-3 pr-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors duration-150 border-r border-zinc-700"
        title="Copy page"
      >
        {copied ? (
          <Check className="size-3.5 text-primary" />
        ) : (
          <Share className="size-3.5" />
        )}
        <span>Share Blog</span>
      </motion.button>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.97 }}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center justify-center h-9 w-10 bg-zinc-800 hover:bg-zinc-700 text-white transition-colors duration-150"
        title="More options"
      >
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronDown className="size-3.5" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            role="menu"
            className="absolute top-[calc(100%+6px)] z-50 min-w-55 bg-zinc-900 border border-zinc-700/60 py-1.5 shadow-xl shadow-black/40"
          >
            {items.map((item) => (
              <a

                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:text-white hover:bg-zinc-700/50 transition-colors duration-100 cursor-pointer"
              >
                <span className="text-zinc-400 shrink-0">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
