import { memo } from "react";
import { getRegistryItem } from "@/lib/registry";
import InstallActions from "./install-actions";

const DocsHeader = memo(function DocsHeader({ name }: { name: string }) {
  const item = getRegistryItem(name);
  if (!item) return null;
  return (
    <header className="max-w-7xl! mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 [&_h1]:mb-0 [&_h1]:shrink-0 [&_h1]:text-4xl">
      <h1 className="typography-page-title">{item.title}</h1>
      <span aria-hidden="true" className="hidden h-10 w-px shrink-0 bg-border sm:block" />
      <p className="typography-body text-lg">{item.description}</p>
      <InstallActions name={name} />
    </header>
  );
});

export default DocsHeader;
