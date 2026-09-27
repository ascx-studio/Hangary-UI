import { cn } from "@/lib/cn";
import { V0Dark } from "@ridemountainpig/svgl-react";

export function OpenInV0({ name, registryUrl, className }: { name: string; registryUrl: string; className?: string }) {
  const itemUrl = `${registryUrl.replace(/\/$/, "")}/r/${name}.json`;

  return (
    <a
      aria-label={`Open ${name} in v0`}
      href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(itemUrl)}`}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex h-6 items-center gap-2  px-3 text-sm font-medium text-background transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <V0Dark  aria-hidden="true" />
    </a>
  );
}
