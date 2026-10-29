"use client";

import { createContext, memo, useContext, useId, useMemo, type ComponentProps } from "react";
import { cn } from "cn";

const AccordionContext = createContext<{ name?: string; defaultValue: readonly string[] } | null>(
  null,
);

type AccordionProps = Omit<ComponentProps<"div">, "defaultValue"> & {
  multiple?: boolean;
  defaultValue?: readonly string[];
};

const emptyValue: readonly string[] = [];

const Accordion = memo(function Accordion({
  multiple = false,
  defaultValue = emptyValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const id = useId();
  const context = useMemo(
    () => ({ name: multiple ? undefined : id, defaultValue }),
    [multiple, id, defaultValue],
  );
  return (
    <AccordionContext.Provider value={context}>
      <div
        {...props}
        data-slot="accordion"
        className={cn("w-full divide-y divide-border border-y border-border", className)}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

const AccordionItem = memo(function AccordionItem({
  value,
  className,
  ...props
}: Omit<ComponentProps<"details">, "name" | "open"> & { value: string }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be rendered inside Accordion.");
  return (
    <details
      {...props}
      data-slot="accordion-item"
      name={context.name}
      open={context.defaultValue.includes(value) || undefined}
      className={cn("group/accordion-item", className)}
    />
  );
});

const AccordionTrigger = memo(function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<"summary">) {
  return (
    <summary
      {...props}
      data-slot="accordion-trigger"
      className={cn(
        "flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left text-base font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden",
        className,
      )}
    >
      <span>{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="mt-1 size-4 shrink-0 group-open/accordion-item:rotate-180"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </summary>
  );
});

const AccordionContent = memo(function AccordionContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="accordion-content"
      className={cn("typography-body pb-5", className)}
    />
  );
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
