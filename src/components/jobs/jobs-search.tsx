"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  initialSearch?: string;
};

export function JobsSearch({ initialSearch = "" }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
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

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1 flex items-center gap-3 rounded-2xl sm:rounded-3xl border border-border bg-card/50 p-1.5 focus-within:border-brand-border focus-within:ring-2 focus-within:ring-brand/15 dark:focus-within:ring-brand/20 transition-all duration-300">
          <Search className="ml-3 h-5 w-5 text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search jobs..."
            className="h-12 w-full bg-transparent px-1 text-foreground outline-none placeholder:text-muted/65 text-sm sm:text-base pr-10"
          />

          {/* Keyboard shortcut indicator */}
          <div className="absolute right-3 hidden sm:flex items-center pointer-events-none shrink-0">
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

