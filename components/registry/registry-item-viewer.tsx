"use client";

import { useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Check, GripVertical, Info, X } from "lucide-react";
import { OpenInV0 } from "@/components/open-in-v0";

type RegistryItemViewerPanel = "description" | "install";

type RegistryItemViewerProps = {
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

export default function RegistryItemViewer({ title, name, registryUrl, description, documentation, command, children }: RegistryItemViewerProps) {
  const detailsId = useId();
  const [activePanel, setActivePanel] = useState<RegistryItemViewerPanel | null>(null);
  const [installCopyStatus, setInstallCopyStatus] = useState("");
  const [actionBarOffset, setActionBarOffset] = useState({ x: 0, y: 0 });
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const actionDragStartRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number; rect: DOMRect; bounds: DOMRect } | null>(null);
  const isDetailsSidebarOpen = activePanel !== null;
  const iconActionButtonClass = "inline-flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-muted aria-pressed:text-foreground";
  const installCommandButtonClass = "inline-flex h-9 max-w-[min(17rem,45vw)] shrink items-center gap-2 px-2 font-mono text-xs text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring";

  function openInstallPanelAndCopyCommand() {
    setActivePanel("install");
    void copyInstallCommand();
  }

  async function copyInstallCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setInstallCopyStatus("Copied!");
    } catch {
      setInstallCopyStatus("Couldn’t copy. Select and copy the command below.");
    }
  }

  function dragActionBar(event: PointerEvent<HTMLButtonElement>) {
    const start = actionDragStartRef.current;
    if (!start) return;
    const x = start.x + event.clientX - start.pointerX;
    const y = start.y + event.clientY - start.pointerY;
    setActionBarOffset({
      x: Math.min(Math.max(x, start.x + start.bounds.left - start.rect.left), start.x + start.bounds.right - start.rect.right),
      y: Math.min(Math.max(y, start.y + start.bounds.top - start.rect.top), start.y + start.bounds.bottom - start.rect.bottom),
    });
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div ref={previewAreaRef} className="relative min-h-0 w-full flex-1">
        <div data-item-actions className="absolute bottom-2 left-1/2 z-30 flex w-fit max-w-[calc(100%-1rem)] items-center gap-1 rounded-lg border border-border bg-card/95 px-1 text-card-foreground shadow-lg backdrop-blur" style={{ transform: `translate(calc(-50% + ${actionBarOffset.x}px), ${actionBarOffset.y}px)` }}>
          <button
            type="button"
            aria-label="Drag item actions"
            title="Drag item actions; use arrow keys to move"
            className="inline-flex size-9 shrink-0 touch-none cursor-grab items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-ring"
            onPointerDown={event => {
              if (event.button !== 0) return;
              const rect = event.currentTarget.parentElement?.getBoundingClientRect();
              const bounds = previewAreaRef.current?.getBoundingClientRect();
              if (!rect || !bounds) return;
              actionDragStartRef.current = { pointerX: event.clientX, pointerY: event.clientY, x: actionBarOffset.x, y: actionBarOffset.y, rect, bounds };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={dragActionBar}
            onPointerUp={event => {
              actionDragStartRef.current = null;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={() => { actionDragStartRef.current = null; }}
            onKeyDown={event => {
              const steps: Record<string, [number, number]> = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] };
              if (event.key === "Home") {
                event.preventDefault();
                setActionBarOffset({ x: 0, y: 0 });
              } else if (steps[event.key]) {
                event.preventDefault();
                const [x, y] = steps[event.key];
                const rect = event.currentTarget.parentElement?.getBoundingClientRect();
                const bounds = previewAreaRef.current?.getBoundingClientRect();
                if (!rect || !bounds) return;
                setActionBarOffset(position => ({
                  x: Math.min(Math.max(position.x + x, position.x + bounds.left - rect.left), position.x + bounds.right - rect.right),
                  y: Math.min(Math.max(position.y + y, position.y + bounds.top - rect.top), position.y + bounds.bottom - rect.bottom),
                }));
              }
            }}
          >
            <GripVertical size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            title="Info"
            aria-label={`Open ${title} information`}
            aria-pressed={activePanel === "description"}
            aria-controls={`${detailsId}-sidebar`}
            onClick={() =>
              setActivePanel(activePanel === "description" ? null : "description")
            }
            className={iconActionButtonClass}
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
            aria-controls={`${detailsId}-sidebar`}
            onClick={openInstallPanelAndCopyCommand}
            className={installCommandButtonClass}
          >
            <span className="truncate p-1 text-sm">
              @hangaury/{name}
            </span>
          </button>
          <span aria-hidden="true" className="px-1 text-xs">
            |
          </span>
          <OpenInV0 name={name} registryUrl={registryUrl} />
        </div>
        {children}
      </div>
      <aside
        id={`${detailsId}-sidebar`}
        aria-label={`${title} details`}
        aria-hidden={!isDetailsSidebarOpen}
        inert={!isDetailsSidebarOpen}
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(30rem,92vw)] min-w-0 flex-col overflow-hidden border-l border-border bg-card text-card-foreground shadow-2xl transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${isDetailsSidebarOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"}`}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border p-2">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
            <button
              type="button"
              title="Info"
              aria-label="Show information"
              aria-pressed={activePanel === "description"}
              onClick={() => setActivePanel("description")}
              className={iconActionButtonClass}
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
              onClick={openInstallPanelAndCopyCommand}
              className={installCommandButtonClass}
            >
              <span className="truncate">@hangaury/{name}</span>
              {installCopyStatus === "Copied!" && (
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
              onClick={() => setActivePanel(null)}
              className={iconActionButtonClass}
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        </header>

        {activePanel === "description" && (
          <section
            id={`${detailsId}-description`}
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

        {activePanel === "install" && (
          <section
            id={`${detailsId}-install`}
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
