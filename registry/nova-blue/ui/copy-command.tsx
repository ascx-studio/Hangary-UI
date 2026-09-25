"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyCommandProps {
  command: string;
  label?: string;
  className?: string;
}

export default function CopyCommand({
  command,
  label = "Get Code",
  className = "",
}: Readonly<CopyCommandProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 gap-3 border border-white/10 transition-all bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md group cursor-pointer w-full rounded-base text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <span className="text-sm md:text-base font-bold text-white whitespace-nowrap shrink-0">
          {label}
        </span>
        <div className="flex-1 min-w-0 w-full rounded bg-black/40 px-3 py-1.5 border border-white/5 group-hover:border-white/10 transition-colors">
          <code className="block text-xs md:text-sm font-mono text-blue-400 overflow-x-auto whitespace-nowrap scrollbar-none">
            {command}
          </code>
        </div>
      </div>

      <div className="flex items-center justify-center shrink-0 sm:ml-2 sm:pl-4 sm:border-l border-white/10 min-h-[24px]">
        {copied ? (
          <div className="flex items-center gap-2 text-green-400">
            <Check size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest sm:hidden">Copied</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
            <Copy size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest sm:hidden">Copy</span>
          </div>
        )}
      </div>
    </button>
  );
}
