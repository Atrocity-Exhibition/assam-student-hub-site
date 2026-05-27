"use client";

import { Sun, Moon } from "lucide-react";

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
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed border border-border bg-card/45 text-foreground hover:bg-card hover:border-zinc-400 dark:hover:border-zinc-700 h-10 w-10 p-0 rounded-full touch-manipulation"
      aria-label="Toggle light/dark theme"
      suppressHydrationWarning
    >
      <Sun className="h-5 w-5 dark:block hidden" />
      <Moon className="h-5 w-5 dark:hidden block" />
    </button>
  );
}
