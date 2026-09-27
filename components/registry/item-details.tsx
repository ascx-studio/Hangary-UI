"use client";

import { useId, useState, type ReactNode } from "react";
import { Check, Copy, Info, X } from "lucide-react";
import { OpenInV0 } from "@/components/open-in-v0";

type ItemDetailsProps = {
  title: string;
  name: string;
  registryUrl: string;
  description: string;
  documentation: ReactNode;
  command: string;
  files: string[];
  dependencies: string[];
  children: ReactNode;
};

export default function ItemDetails({ title, name, registryUrl, description, documentation, command, files, dependencies, children }: ItemDetailsProps) {
  const id = useId();
  const [panel, setPanel] = useState<"description" | "install" | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const isOpen = panel !== null;
  const actionClass = "inline-flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-muted aria-pressed:text-foreground";
  const commandButtonClass = "inline-flex h-9 max-w-[min(17rem,45vw)] shrink items-center gap-2 px-2 font-mono text-xs text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring";

  function showInstallAndCopy() {
    setPanel("install");
    void copyCommand();
  }

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopyStatus("Copied!");
    } catch {
      setCopyStatus("Couldn’t copy. Select and copy the command below.");
    }
  }

  return (
    <div className="flex  flex-col gap-3">
      <div className="-mt-2 flex items-center justify-end gap-1">
        <button
          type="button"
          title="Info"
          aria-label={`Open ${title} information`}
          aria-pressed={panel === "description"}
          aria-controls={`${id}-sidebar`}
          onClick={() =>
            setPanel(panel === "description" ? null : "description")
          }
          className={actionClass}
        >
          <Info size={17} aria-hidden="true" />
        </button>
        <span aria-hidden="true" className="px-1 text-xs text-muted-foreground">
          |
        </span>
        <button
          type="button"
          title={`Copy install command for ${title}`}
          aria-label={`Copy install command for ${title}`}
          aria-controls={`${id}-sidebar`}
          onClick={showInstallAndCopy}
          className={commandButtonClass}
        >
          <span className="truncate text-sm  p-1">
            @ hangaury/{name}
          </span>
        </button>
        <span aria-hidden="true" className="px-1 text-xs ">
          |
        </span>
        <OpenInV0 name={name} registryUrl={registryUrl} />
      </div>
      {children}
      <aside
        id={`${id}-sidebar`}
        aria-label={`${title} details`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(24rem,90vw)] min-w-0 max-w-[90vw] flex-col overflow-hidden border-l border-border bg-card text-card-foreground shadow-2xl transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"}`}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border p-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Info"
              aria-label="Show information"
              aria-pressed={panel === "description"}
              onClick={() => setPanel("description")}
              className={actionClass}
            >
              <Info size={17} aria-hidden="true" />
            </button>
            <span
              aria-hidden="true"
              className="px-1 text-xs text-muted-foreground"
            >
              |
            </span>
            <button
              type="button"
              title={`Copy install command for ${title}`}
              aria-label={`Copy install command for ${title}`}
              onClick={showInstallAndCopy}
              className={commandButtonClass}
            >
              <span className="truncate">@hangaury/{name}</span>
              {copyStatus === "Copied!" && (
                <Check size={14} aria-hidden="true" />
              )}
            </button>
            <span
              aria-hidden="true"
              className="px-1 text-xs text-muted-foreground"
            >
              |
            </span>
            <OpenInV0 name={name} registryUrl={registryUrl} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Close sidebar"
              aria-label="Close sidebar"
              onClick={() => setPanel(null)}
              className={actionClass}
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        </header>

        {panel === "description" && (
          <section
            id={`${id}-description`}
            className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto p-4"
          >
            <h2 className="text-sm font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
            <div className="mt-6 min-w-0 max-w-full border-t border-border pt-5 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto">
              {documentation}
            </div>
          </section>
        )}

        {panel === "install" && (
          <section
            id={`${id}-install`}
            className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium">Install {title}</h2>

            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
            <pre
              tabIndex={0}
              aria-label="Installation command"
              className="mt-3 max-w-full overflow-x-auto border border-border bg-muted/50 p-3 text-xs leading-6 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <code>{command}</code>
            </pre>


          </section>
        )}
      </aside>
    </div>
  );
}
