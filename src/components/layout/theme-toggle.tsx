"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";

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
      <Button
        variant="secondary"
        size="sm"
        className="h-9 w-9 p-0 rounded-full"
        disabled
        aria-label="Theme toggle loading placeholder"
      />
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="secondary"
      size="sm"
      className="h-9 w-9 p-0 rounded-full"
      aria-label="Toggle light/dark theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-45" />
      )}
    </Button>
  );
}
