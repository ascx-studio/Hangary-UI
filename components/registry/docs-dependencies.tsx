import { memo } from "react";
import { MotionDark, VercelDark, ReactDark } from "@ridemountainpig/svgl-react";
import { Package } from "lucide-react";
import { getRegistryItem } from "@/lib/registry";

const icons = { motion: MotionDark, vgpu: VercelDark, react: ReactDark };
const DocsDependencies = memo(function DocsDependencies({ name }: { name: string }) {
  const dependencies = [
    ...new Set(
      (getRegistryItem(name)?.dependencies ?? [])
        .map((value) => value.replace(/@[^@/]+$/, ""))
        .filter((value) => value !== "cn" && value !== "@vgpu/wgsl"),
    ),
  ];
  return dependencies.length ? (
    <section aria-labelledby={`${name}-dependencies`} className="mt-10">
      <h2 id={`${name}-dependencies`} className="typography-section-title mb-4">
        Dependencies
      </h2>
      <ul aria-label="Dependencies" className="m-0 flex list-none flex-wrap gap-3 p-0">
      {dependencies.map((dependency) => {
        const Icon = icons[dependency as keyof typeof icons] ?? Package;
        return (
          <li
            key={dependency}
            className="inline-flex items-center gap-2.5 rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground"
          >
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            <span>{dependency === "motion" ? "Motion" : dependency}</span>
          </li>
        );
      })}
      </ul>
    </section>
  ) : (
    null
  );
});

export default DocsDependencies;
