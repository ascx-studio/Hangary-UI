"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Bun, NPM, PnpmDark, V0Dark } from "@ridemountainpig/svgl-react";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "@/hangry/components/toast";
import { Tooltip } from "@/hangry/components/tooltip";
import { Button } from "@/hangry/components/button";

const managers = {
  bun: { icon: Bun, prefix: "bunx" },
  npm: { icon: NPM, prefix: "npx" },
  pnpm: { icon: PnpmDark, prefix: "pnpm dlx" },
} as const;
type Manager = keyof typeof managers;

const InstallActions = memo(function InstallActions({ name }: { name: string }) {
  const [manager, setManager] = useState<Manager>("bun");
  const [copied, setCopied] = useState<string>();
  const [error, setError] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const Icon = managers[manager].icon;

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(undefined), 1200);
      setError(false);
      toast.success(`${label} copied`);
    } catch {
      setError(true);
      toast.error("Could not copy. Please try again.");
    }
  }

  return (
    <div
      className="flex shrink-0 items-center sm:ml-auto"
      role="group"
      aria-label="Install actions"
    >
      <Tooltip content="Open in v0" side="bottom">
        <Button
          variant="ghost"
          href={`https://v0.app/chat/api/open?url=https://ui.razeev.com/r/${name}.json`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in v0"
          className="h-11 shrink-0 px-3! text-sm font-semibold"
        >
          Open in <V0Dark className="invert dark:invert-0 size-5 " aria-hidden="true" />
        </Button>
      </Tooltip>
      <Tooltip content="Copy AI installation prompt" side="bottom">
        <Button
          variant="ghost"
          className="h-11 shrink-0 border-l border-border px-3!"
          aria-label="Copy AI installation prompt"
          onClick={() =>
            copy(
              `Add the ${name} component from Hangry UI to this project. Install it with the project's package manager using shadcn@latest add https://ui.razeev.com/r/${name}.json, then integrate it with the existing layout and styling.`,
              "AI prompt",
            )
          }
        >
          {copied === "AI prompt" ? (
            <Check className="size-5" aria-hidden="true" />
          ) : (
            <Sparkles className="size-5" aria-hidden="true" />
          )}
          Prompt
        </Button>
      </Tooltip>
      <div className="flex items-center border-l border-border">
        <Tooltip content={`Copy ${manager} install command`} side="bottom">
          <Button
            variant="ghost"
            className="h-11 shrink-0 px-3!"
            aria-label={`Copy ${manager} installation command`}
            onClick={() =>
              copy(
                `${managers[manager].prefix} shadcn@latest add https://ui.razeev.com/r/${name}.json`,
                `${manager} install command`,
              )
            }
          >
            {copied === `${manager} install command` ? (
              <Check className="size-5" aria-hidden="true" />
            ) : (
              <Icon className="size-5" aria-hidden="true" />
            )}
            {manager}
          </Button>
        </Tooltip>
        <details ref={menuRef} className="relative">
          <summary
            aria-label="Select package manager"
            className="flex h-11 w-6 cursor-pointer list-none items-center justify-center text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden"
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-full z-20 min-w-32 border border-border bg-card p-1 shadow-lg">
            {(Object.entries(managers) as [Manager, (typeof managers)[Manager]][]).map(
              ([option, { icon: OptionIcon }]) => (
                <button
                  key={option}
                  type="button"
                  aria-current={manager === option ? "true" : undefined}
                  onClick={() => {
                    setManager(option);
                    if (menuRef.current) menuRef.current.open = false;
                    void copy(
                      `${managers[option].prefix} shadcn@latest add https://ui.razeev.com/r/${name}.json`,
                      `${option} install command`,
                    );
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <OptionIcon className="size-4" aria-hidden="true" />
                  {option}
                </button>
              ),
            )}
          </div>
        </details>
      </div>
      <span className="sr-only" role="status">
        {error
          ? "Could not copy installation command. Please try again."
          : copied
            ? `${copied} copied.`
            : ""}
      </span>
    </div>
  );
});

export default InstallActions;
