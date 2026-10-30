import { memo } from "react";
import { Breadcrumb } from "@/registry/components/breadcrumb";
import { getRegistryCategory, getRegistryItem } from "@/lib/registry";
import InstallActions from "./install-actions";

const DocsHeader = memo(function DocsHeader({
  name,
  title: titleOverride,
  showTitleDescription = false,
  showActions = true,
  showBreadcrumb = true,
}: {
  name: string;
  title?: string;
  showTitleDescription?: boolean;
  showActions?: boolean;
  showBreadcrumb?: boolean;
}) {
  const item = getRegistryItem(name);
  if (!item) return null;
  const category = getRegistryCategory(item);
  const categoryTitle = {
    components: "Components",
    blocks: "Blocks",
    shader: "Shaders",
    utils: "Utilities",
  }[category];
  const title = titleOverride ?? item.title;
  return (
    <header className="max-w-7xl! mb-8 flex flex-col gap-3 sm:gap-5">
      {(showBreadcrumb || showActions) && (
        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          {showBreadcrumb ? (
            <Breadcrumb
              className="min-w-0"
              items={[
                { label: categoryTitle, href: `/${category === "shader" ? "shader" : category}` },
                { label: title },
              ]}
            />
          ) : (
            <span aria-hidden="true" />
          )}
          {showActions && <InstallActions name={name} />}
        </div>
      )}
      {showTitleDescription && <h1 className="typography-page-title text-4xl">{title}</h1>}
    </header>
  );
});

export default DocsHeader;
