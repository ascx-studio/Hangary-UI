"use client";

import { memo, useState } from "react";
import { Bun, NPM, PnpmDark } from "@ridemountainpig/svgl-react";
import { Check, Sparkles } from "lucide-react";
import { toast } from "@/registry/components/toast";
import { Tooltip } from "@/registry/components/tooltip";
import { Button } from "@/registry/components/button";

const managers = { bun: Bun, npm: NPM, pnpm: PnpmDark };
const prefixes = { bun: "bunx", npm: "npx", pnpm: "pnpm dlx" };

const InstallActions = memo(function InstallActions({ name }: { name: string }) {
  const [copied, setCopied] = useState<string>();
  const [error, setError] = useState(false);
  return (
    <div className="flex shrink-0 items-center [&>div+div]:border-l [&>div+div]:border-border sm:ml-auto" role="group" aria-label="Copy installation command">
      <Tooltip content="Copy AI installation prompt" side="bottom">
      <Button variant="ghost" className="size-11 shrink-0 p-0!"
        aria-label="Copy AI installation prompt"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(`Add the ${name} component from Hangry UI to this project. Install it with the project's package manager using shadcn@latest add https://ui.razeev.com/r/${name}.json, then integrate it with the existing layout and styling.`);
            setCopied("AI");
            toast.success("AI prompt copied");
            setError(false);
          } catch { setError(true); toast.error("Could not copy. Please try again."); }
        }}
      >
        {copied === "AI" ? <Check className="size-6 shrink-0" aria-hidden="true" /> : <Sparkles className="size-6 shrink-0" aria-hidden="true" />}
      </Button>
      </Tooltip>
      {Object.entries(managers).map(([manager, Icon]) => (
        <Tooltip key={manager} content={`Copy ${manager} install command`} side="bottom">
        <Button variant="ghost" className="size-11 shrink-0 p-0!"
          aria-label={`Copy ${manager} installation command`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`${prefixes[manager as keyof typeof prefixes]} shadcn@latest add https://ui.razeev.com/r/${name}.json`);
              setCopied(manager);
              toast.success(`${manager} install command copied`);
              setError(false);
            } catch { setError(true); toast.error("Could not copy. Please try again."); }
          }}
        >
          {copied === manager ? <Check className="size-6 shrink-0" aria-hidden="true" /> : <Icon className="size-6 shrink-0" aria-hidden="true" />}
        </Button>
        </Tooltip>
      ))}
      <span className="sr-only" role="status">{error ? "Could not copy installation command. Please try again." : copied ? `${copied} installation command copied.` : ""}</span>
    </div>
  );
});

export default InstallActions;
