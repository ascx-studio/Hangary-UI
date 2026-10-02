"use client";

import Preview from "./preview";
import { previewEntries } from "./preview-entries";

export default function ComponentPreview({ name, componentProps }: { name: string; componentProps: Record<string, string | number | boolean> }) {
  const entry = previewEntries[name];
  const Component = entry?.component;

  return (
    <Preview className="h-full min-h-0 w-full max-w-none bg-neutral-900 justify-start overflow-hidden p-0 sm:p-0">
      <div className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-auto p-4 sm:p-6">
        <div className={`my-auto w-full shrink-0 ${entry?.category === "shader" ? "h-full overflow-hidden" : ""}`}>
          {Component ? <Component key={JSON.stringify(componentProps)} {...componentProps} /> : <p className="text-center text-sm text-muted-foreground">Preview coming soon.</p>}
        </div>
      </div>
    </Preview>
  );
}
