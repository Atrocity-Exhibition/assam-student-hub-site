"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    
    const animFrame = requestAnimationFrame(() => {
      setTheme(isLight ? "light" : "dark");
      setMounted(true);
    });
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    }
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-zinc-200 dark:border-zinc-800 bg-transparent" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200 shadow-sm"
      aria-label="Toggle light/dark theme"
    >
      {theme === "light" ? (
        <Moon className="h-4.5 w-4.5 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Sun className="h-4.5 w-4.5 transition-transform duration-300 rotate-0 hover:rotate-45" />
      )}
    </button>
  );
}
