import { memo, type ComponentProps } from "react";
import { Button } from "../components/button";

export type NotFoundProps = ComponentProps<"section"> & {
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export const NotFoundLayout = memo(function NotFoundLayout({
  title = "This page took a wrong turn.",
  description = "The page you’re looking for may have moved, or the link might be a little off. Let’s get you somewhere familiar.",
  homeHref = "/",
  homeLabel = "Back to home",
  secondaryHref,
  secondaryLabel = "Contact support",
  className = "",
  layout = "centered",
  ...props
}: NotFoundProps & { layout?: "centered" | "split" | "terminal" }) {
  const split = layout === "split";
  const terminal = layout === "terminal";
  return (
    <section
      {...props}
      className={`w-full min-w-0 overflow-hidden border border-border bg-background text-foreground ${className}`}
    >
      {terminal && (
        <div
          aria-hidden="true"
          className="flex items-center gap-2 border-b border-border bg-muted/40 px-6 py-4"
        >
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="size-2 rounded-full bg-muted-foreground/40" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">navigation / request</span>
        </div>
      )}
      <div className={split ? "grid sm:grid-cols-2" : "px-6 py-16 sm:px-12 sm:py-24"}>
        <div
          aria-hidden="true"
          className={
            split
              ? "flex min-h-64 items-center justify-center border-b border-border bg-muted/30 p-8 sm:border-r sm:border-b-0"
              : terminal
                ? "mb-10"
                : "mb-8 text-center"
          }
        >
          {terminal ? (
            <div className="space-y-3 font-mono text-sm">
              <p className="text-muted-foreground">$ find requested-page</p>
              <p className="text-emerald-700 dark:text-emerald-500">Error 404: resource not found</p>
              <p className="text-muted-foreground">→ Try a different destination.</p>
            </div>
          ) : (
            <span className="select-none font-mono text-[clamp(5rem,18cqw,10rem)] leading-none font-semibold tracking-tighter text-foreground/15">
              404<span className="text-emerald-700 dark:text-emerald-500">.</span>
            </span>
          )}
        </div>
        <div
          className={
            split
              ? "flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-20"
              : terminal
                ? "max-w-lg"
                : "mx-auto max-w-lg text-center"
          }
        >
          <p className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            404 / Page not found
          </p>
          <h2 className={"typography-section-title"}>{title}</h2>
          <p className={`mt-4 typography-body`}>{description}</p>
          <div
            className={`mt-8 flex flex-wrap gap-3 ${!split && !terminal ? "justify-center" : ""}`}
          >
            <Button href={homeHref}>
              {homeLabel}
              <span aria-hidden="true">↗</span>
            </Button>
            {secondaryHref && (
              <Button href={secondaryHref} variant="ghost">
                {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});
