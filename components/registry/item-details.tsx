"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowUpRight, Check, Copy, Download, Info, X } from "lucide-react";

type ItemDetailsProps = {
  title: string;
  description: string;
  documentation: ReactNode;
  command: string;
  files: string[];
  dependencies: string[];
};

export default function ItemDetails({ title, description, documentation, command, files, dependencies }: ItemDetailsProps) {
  const id = useId();
  const [panel, setPanel] = useState<"description" | "install" | "docs" | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const actionClass = "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-expanded:bg-muted aria-expanded:text-foreground";

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopyStatus("Copied!");
    } catch {
      setCopyStatus("Couldn’t copy. Select and copy the command below.");
    }
  }

  return (
    <article className="min-w-0 bg-card text-card-foreground">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-card px-4 py-2">
        <div className="flex gap-1">
          <button type="button" title="Description" aria-label={`About ${title}`} aria-expanded={panel === "description"} aria-controls={`${id}-description`} onClick={() => setPanel(panel === "description" ? null : "description")} className={actionClass}><Info size={17} aria-hidden="true" /></button>
          <button type="button" title="Install" aria-label={`Install ${title}`} aria-expanded={panel === "install"} aria-controls={`${id}-install`} onClick={() => setPanel(panel === "install" ? null : "install")} className={actionClass}><Download size={17} aria-hidden="true" /></button>
        </div>
        {panel && <button type="button" aria-label="Close details" onClick={() => setPanel(null)} className={actionClass}><X size={17} aria-hidden="true" /></button>}
      </div>
      <div id={`${id}-description`} hidden={panel !== "description"} className="border-t border-border p-4">
        <h3 className="text-sm font-medium">Description</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <button type="button" onClick={() => setPanel("docs")} aria-controls={`${id}-docs`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">Preview & documentation <ArrowUpRight size={15} aria-hidden="true" /></button>
      </div>
      <div id={`${id}-install`} hidden={panel !== "install"} className="min-w-0 border-t border-border p-4">
        <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-medium">Install {title}</h3><button type="button" onClick={copyCommand} aria-label={`Copy install command for ${title}`} title="Copy command" className={actionClass}>{copyStatus === "Copied!" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}</button></div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <pre tabIndex={0} aria-label="Installation command" className="mt-3 overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-xs leading-6 focus-visible:outline-2 focus-visible:outline-ring"><code>{command}</code></pre>
        <p role="status" className="mt-2 text-xs text-muted-foreground">{copyStatus}</p>
        <details className="mt-4 text-sm"><summary className="cursor-pointer font-medium">Included files ({files.length})</summary><ul className="mt-2 space-y-2">{files.map(file => <li key={file} className="break-all font-mono text-xs text-muted-foreground">{file}</li>)}</ul></details>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">Requires React and Tailwind CSS 4.{dependencies.length > 0 ? ` Additional packages: ${dependencies.join(", ")}.` : " No additional packages needed."}</p>
        <button type="button" onClick={() => setPanel("docs")} aria-controls={`${id}-docs`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">Usage & full documentation <ArrowUpRight size={15} aria-hidden="true" /></button>
      </div>
      <div id={`${id}-docs`} hidden={panel !== "docs"} className="border-t border-border p-4">{documentation}</div>
    </article>
  );
}
