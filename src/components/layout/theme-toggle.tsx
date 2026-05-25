"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const isLight = root.classList.contains("light");
    const next = isLight ? "dark" : "light";

    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="secondary"
      size="icon"
      aria-label="Toggle light/dark theme"
      suppressHydrationWarning
    >
      <Sun className="h-5 w-5 dark:block hidden" />
      <Moon className="h-5 w-5 dark:hidden block" />
    </Button>
  );
}
