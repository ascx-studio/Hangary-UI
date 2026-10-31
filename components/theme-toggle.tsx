"use client";

import { memo } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/registry/components/button";

const ThemeToggle = memo(function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      aria-label="Toggle light and dark mode"
      className="size-11 p-0!"
      onClick={() => {
        const dark = document.documentElement.classList.toggle("dark");
        try {
          localStorage.setItem("theme", dark ? "dark" : "light");
        } catch {
          // The switch still works when browser storage is unavailable.
        }
      }}
    >
      <Sun aria-hidden="true" size={20} className="hidden dark:block" />
      <Moon aria-hidden="true" size={20} className="dark:hidden" />
    </Button>
  );
});

export default ThemeToggle;
