"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  initialSearch?: string;
  currentCategory?: string;
  basePath?: string;
};

const getCategoryContext = (cat?: string) => {
  if (!cat || cat === "All" || cat === "academic") {
    return {
      label: null,
      placeholder: "Search notices, exams, recruitment...",
    };
  }

  switch (cat.toLowerCase()) {
    case "recruitment":
      return {
        label: "Jobs",
        placeholder: "Search recruitments, job posts, board announcements...",
      };
    case "result":
      return {
        label: "Results",
        placeholder: "Search exam results, selection lists, scorecards...",
      };
    case "exam":
      return {
        label: "Exams",
        placeholder: "Search competitive exams, routines, timetables...",
      };
    case "admission":
      return {
        label: "Admissions",
        placeholder: "Search college admissions, entry circulars...",
      };
    case "scholarship":
      return {
        label: "Scholarships",
        placeholder: "Search scholarships, fellowships, grant announcements...",
      };
    case "notice":
      return {
        label: "Notices",
        placeholder: "Search academic notices, announcements...",
      };
    default:
      return {
        label: cat,
        placeholder: `Search within ${cat.toLowerCase()}...`,
      };
  }
};

export function NoticesSearch({ initialSearch = "", currentCategory = "All", basePath }: Props) {
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

    if (currentCategory && currentCategory !== "All" && currentCategory !== "academic") {
      params.set("category", currentCategory);
    }

    const path = basePath || "/jobs";
    router.push(`${path}?${params.toString()}`);
  }

  const { label, placeholder } = getCategoryContext(currentCategory);

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1 flex items-center gap-2 rounded-2xl sm:rounded-3xl border border-border bg-card/50 p-1.5 focus-within:border-brand-border focus-within:ring-2 focus-within:ring-brand/15 dark:focus-within:ring-brand/20 transition-all duration-300">
          <Search className="ml-3 h-5 w-5 text-muted shrink-0" />
          
          {label && (
            <span className="hidden sm:inline-flex shrink-0 items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 border border-emerald-500/20">
              {label}
            </span>
          )}

          <input
            ref={inputRef}
            type="text"
            id="notices-search-input"
            name="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder}
            className="h-12 w-full bg-transparent px-1 text-zinc-900 dark:text-white outline-none placeholder:text-muted text-sm pr-10"
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
