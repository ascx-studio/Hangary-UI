"use client";

import { memo, useEffect, useId, useRef, useState, type ComponentProps } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/hangry/components/button";
import { Kbd } from "@/hangry/components/kbd";
import { ThemeSwitcher } from "@/hangry/components/theme-switcher";
import Logo from "@/components/ui/Logo";

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  keywords?: readonly string[];
  shortcut?: string;
  disabled?: boolean;
}

export interface CommandProps extends Omit<ComponentProps<"div">, "onSelect"> {
  items?: readonly CommandItem[];
  onSelect?: (item: CommandItem) => void;
  placeholder?: string;
  label?: string;
  emptyMessage?: string;
}

const DEFAULT_ITEMS: readonly CommandItem[] = [
  {
    id: "components",
    label: "Components",
    group: "Components",
    shortcut: "G C",
  },
  { id: "blocks", label: "Blocks", group: "Blocks", shortcut: "G B" },
  { id: "shaders", label: "Shaders", group: "Shaders", shortcut: "G S" },
  { id: "bookmarks", label: "Bookmarks", group: "Menu", shortcut: "G M" },
  {
    id: "insights",
    label: "Insights",
    group: "Menu",
    shortcut: "G I",
    disabled: true,
  },
];

export const Command = memo(function Command({
  items = DEFAULT_ITEMS,
  onSelect,
  placeholder = "Type a command or search…",
  label = "Search commands",
  emptyMessage = "No commands found.",
  className,
  ...props
}: CommandProps = {}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryControlRef = useRef<HTMLDivElement>(null);
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const categoryListRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [category, setCategory] = useState(
    () => items.find((item) => item.group && item.group !== "Menu")?.group ?? "",
  );
  const [categoryOpen, setCategoryOpen] = useState(false);
  const groups = [...new Set(items.map((item) => item.group ?? "Commands"))];
  const scope = groups.includes(category) ? category : "";
  const categories = groups.filter((group) => group !== "Menu");
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filtered = items.filter((item) => {
    const text = [item.label, item.group, ...(item.keywords ?? [])].join(" ").toLocaleLowerCase();
    return (
      (!scope || words.length > 0 || (item.group ?? "Commands") === scope) && words.every((word) => text.includes(word))
    );
  });
  const enabled = filtered.filter((item) => !item.disabled);
  const active = enabled.find((item) => item.id === activeId) ?? enabled[0];
  const optionId = (item: CommandItem) => `${id}-option-${encodeURIComponent(item.id)}`;
  const selectedOptionId = active ? optionId(active) : undefined;

  useEffect(() => {
    if (selectedOptionId && document.activeElement === inputRef.current)
      document.getElementById(selectedOptionId)?.scrollIntoView({ block: "nearest" });
  }, [selectedOptionId]);

  useEffect(() => {
    if (!categoryOpen) return;
    const selected = [
      ...(categoryListRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []),
    ].find((button) => button.getAttribute("aria-selected") === "true");
    selected?.focus();
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!categoryControlRef.current?.contains(event.target as Node)) setCategoryOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [categoryOpen]);

  const renderOption = (item: CommandItem) => (
    <Button
      key={item.id}
      id={optionId(item)}
      role="option"
      aria-selected={item.id === active?.id}
      disabled={item.disabled}
      tabIndex={-1}
      onPointerMove={() => {
        if (!item.disabled) setActiveId(item.id);
      }}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        inputRef.current?.focus();
        onSelect?.(item);
      }}
      variant="ghost"
      className="relative min-h-11! w-full! justify-start! gap-3! rounded-lg! px-2.5! py-0! text-left! text-base! font-normal! focus-visible:outline-none! focus-visible:ring-0"
    >
      {item.id === active?.id && (
        <motion.span
          aria-hidden="true"
          layoutId={`${id}-active`}
          initial={false}
          transition={
            reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }
          }
          className="absolute inset-0 rounded-lg bg-muted"
        />
      )}
      <span className="relative min-w-0 flex-1 truncate">{item.label}</span>
      {item.shortcut && (
        <span className="relative shrink-0 font-mono text-xs tracking-widest text-muted-foreground">
          {item.shortcut}
        </span>
      )}
    </Button>
  );

  return (
    <div
      {...props}
      data-slot="command"
      className={cn(
        "w-full max-w-xl overflow-hidden rounded-lg surface-raised p-2 text-card-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4">
        <Search aria-hidden="true" className="size-6 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          role="combobox"
          aria-label={label}
          aria-expanded={true}
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          aria-describedby={`${id}-hint`}
          aria-activedescendant={active ? optionId(active) : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setActiveId(null);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (!enabled.length) return;
              const current = enabled.findIndex((item) => item.id === active?.id);
              const direction = event.key === "ArrowDown" ? 1 : -1;
              setActiveId(enabled[(current + direction + enabled.length) % enabled.length].id);
            } else if (event.key === "Enter") {
              event.preventDefault();
              if (active) onSelect?.(active);
            } else if (event.key === "Escape" && query) {
              event.preventDefault();
              event.stopPropagation();
              setQuery("");
              setActiveId(null);
            }
          }}
          className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <Kbd label="Esc" aria-hidden="true" className="shrink-0" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="max-h-[min(26rem,calc(100dvh-12rem))] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          <div className="p-1">
            <div className="flex flex-col gap-1 px-2.5 py-2">
              <span className="text-sm font-medium text-muted-foreground">Page</span>
              <div ref={categoryControlRef} className="relative min-w-0">
                <Button
                  ref={categoryTriggerRef}
                  aria-label={`Choose page: ${scope || categories[0] || "Select page"}`}
                  aria-haspopup="listbox"
                  aria-expanded={categoryOpen}
                  aria-controls={categoryOpen ? `${id}-category-list` : undefined}
                  onClick={() => setCategoryOpen((open) => !open)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                      event.preventDefault();
                      setCategoryOpen(true);
                    } else if (event.key === "Escape" && categoryOpen) {
                      event.preventDefault();
                      setCategoryOpen(false);
                    }
                  }}
                  variant="ghost"
                  className="min-h-11! w-full! justify-between! gap-3! rounded-lg! bg-card! px-2.5! py-0! text-left! text-base! font-normal! text-foreground! hover:bg-muted! focus-visible:outline-none! focus-visible:ring-0"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {scope || categories[0] || "Select page"}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                  />
                </Button>
                {categoryOpen && (
                  <div
                    ref={categoryListRef}
                    id={`${id}-category-list`}
                    role="listbox"
                    aria-label="Page categories"
                    className="absolute inset-x-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-card p-1 text-card-foreground shadow-lg"
                  >
                    {categories.map((value) => (
                      <Button
                        key={value}
                        role="option"
                        aria-selected={scope === value}
                        tabIndex={-1}
                        onKeyDown={(event) => {
                          const options = Array.from(
                            categoryListRef.current?.querySelectorAll<HTMLButtonElement>(
                              "button",
                            ) ?? [],
                          );
                          const current = options.indexOf(event.currentTarget);
                          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                            event.preventDefault();
                            const direction = event.key === "ArrowDown" ? 1 : -1;
                            options[
                              (current + direction + options.length) % options.length
                            ]?.focus();
                          } else if (event.key === "Escape") {
                            event.preventDefault();
                            setCategoryOpen(false);
                            categoryTriggerRef.current?.focus();
                          }
                        }}
                        onClick={() => {
                          setCategory(value);
                          setActiveId(null);
                          setCategoryOpen(false);
                          categoryTriggerRef.current?.focus();
                        }}
                        variant="ghost"
                        className="min-h-11! w-full! justify-start! rounded-lg! px-2.5! py-0! text-left! text-base! font-normal! focus-visible:outline-none! focus-visible:ring-0"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="px-2.5 pb-1 pt-2 text-sm font-medium text-muted-foreground">
              {scope || "Pages"}
            </p>
            <div id={`${id}-list`} role="listbox" aria-label="Commands">
              {filtered.map(renderOption)}
            </div>
          </div>
          {!filtered.length && (
            <output className="block px-4 py-12 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </output>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm">
        <div className="flex items-center gap-2">
          <Logo variant="logo" className="size-7" />
          <ThemeSwitcher />
        </div>
        <span className="inline-flex items-center gap-2">
          Select command
          <Kbd label="↵" aria-label="Enter" />
        </span>
        <span id={`${id}-hint`} className="sr-only">
          Use the up and down arrow keys to navigate, and Enter to select. Escape clears the search.
        </span>
      </div>
    </div>
  );
});
