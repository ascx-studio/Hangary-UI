import { memo } from "react";
import { getRegistryItem } from "@/lib/registry";
import InstallActions from "./install-actions";

const DocsHeader = memo(function DocsHeader({ name }: { name: string }) {
  const item = getRegistryItem(name);
  if (!item) return null;
  return (
    <header className="max-w-7xl! mb-8 flex flex-col gap-3 sm:gap-5">
      <div className="flex items-center gap-3">
        <h1 className="typography-page-title text-4xl">{item.title}</h1>
        <InstallActions name={name} />
      </div>
      <p className="typography-body">{item.description}</p>
    </header>
  );
});

export default DocsHeader;
