"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is already typing in an input or textarea
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/jobs");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1 flex items-center rounded-2xl sm:rounded-3xl border border-border bg-card/50 p-1.5 focus-within:border-brand-border focus-within:ring-2 focus-within:ring-brand/15 dark:focus-within:ring-brand/20 transition-all duration-300">
          <Search className="ml-4 h-5 w-5 text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, scholarships, universities, recruitment..."
            className="h-12 w-full bg-transparent px-3 text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-muted text-sm sm:text-base pr-10"
          />
          
          {/* Keyboard shortcut indicator */}
          <div className="absolute right-3 hidden sm:flex items-center pointer-events-none">
            <kbd className="h-5 px-1.5 flex items-center justify-center rounded border border-border bg-card/55 text-[10px] font-medium text-muted font-mono">
              /
            </kbd>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="px-6 py-3 text-sm font-semibold h-12 sm:h-auto rounded-2xl sm:rounded-3xl w-full sm:w-auto shrink-0"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
