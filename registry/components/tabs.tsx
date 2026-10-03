"use client";

import { createContext, useContext, useId, useState, type ComponentProps } from "react";
import { cn } from "cn";

interface TabsProps extends Omit<ComponentProps<"div">, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

const TabsContext = createContext<{
  id: string;
  value?: string;
  orientation: "horizontal" | "vertical";
  select: (value: string) => void;
} | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be rendered inside Tabs.");
  return context;
}

export function Tabs({ className, value, defaultValue, onValueChange, orientation = "horizontal", children, ...props }: TabsProps) {
  const id = useId();
  const [selected, setSelected] = useState(defaultValue);
  function select(next: string) {
    if (value === undefined) setSelected(next);
    onValueChange?.(next);
  }
  return (
    <TabsContext.Provider value={{ id, value: value ?? selected, orientation, select }}>
      <div {...props} data-slot="tabs" data-orientation={orientation} className={cn("group/tabs flex w-full gap-2 data-[orientation=horizontal]:flex-col", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function tabsListVariants({ variant = "default" }: { variant?: "default" | "line" } = {}) {
  return cn(
    "group/tabs-list inline-flex w-fit items-center justify-center p-1 text-muted-foreground group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
    variant === "line" ? "gap-1 bg-transparent" : "bg-muted",
  );
}

export function TabsList({ className, variant = "default", onKeyDown, ...props }: ComponentProps<"div"> & { variant?: "default" | "line" }) {
  const { orientation } = useTabs();
  return (
    <div {...props} role="tablist" aria-orientation={orientation} data-slot="tabs-list" data-variant={variant} className={cn(tabsListVariants({ variant }), className)} onKeyDown={event => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const tabs = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')].filter(tab => tab.closest('[role="tablist"]') === event.currentTarget);
      const index = tabs.indexOf(event.target as HTMLButtonElement);
      if (index < 0) return;
      const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
      const backward = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
      const next = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs.at(-1)
        : event.key === forward ? tabs[(index + 1) % tabs.length]
        : event.key === backward ? tabs[(index - 1 + tabs.length) % tabs.length] : undefined;
      if (!next) return;
      event.preventDefault();
      next.focus();
      next.click();
    }} />
  );
}

export function TabsTrigger({ className, value, disabled, onClick, ...props }: Omit<ComponentProps<"button">, "value"> & { value: string }) {
  const tabs = useTabs();
  const active = !disabled && tabs.value === value;
  const key = encodeURIComponent(value);
  return (
    <button {...props} type="button" role="tab" id={`${tabs.id}-tab-${key}`} aria-controls={`${tabs.id}-panel-${key}`} aria-selected={active} disabled={disabled} tabIndex={active || tabs.value === undefined && !disabled ? 0 : -1} data-slot="tabs-trigger" data-active={active ? "" : undefined}
      className={cn(
        "relative inline-flex min-h-8 flex-1 items-center justify-center gap-1.5 border border-border px-3 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        "data-active:bg-background data-active:text-foreground group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[variant=line]/tabs-list:data-active:after:opacity-100 group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-1 group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5",
        className,
      )} onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) tabs.select(value);
      }} />
  );
}

export function TabsContent({ className, value, ...props }: ComponentProps<"div"> & { value: string }) {
  const tabs = useTabs();
  const key = encodeURIComponent(value);
  return <div {...props} role="tabpanel" id={`${tabs.id}-panel-${key}`} aria-labelledby={`${tabs.id}-tab-${key}`} hidden={tabs.value !== value} tabIndex={0} data-slot="tabs-content" className={cn("min-w-0 flex-1 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-ring", className)} />;
}
