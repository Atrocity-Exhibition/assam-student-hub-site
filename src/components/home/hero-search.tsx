"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Briefcase, GraduationCap, Building2, Trophy, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          <label htmlFor="hero-search-input" className="sr-only">Search notices, exams, recruitment...</label>
          <input
            ref={inputRef}
            type="text"
            id="hero-search-input"
            name="search"
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

      {/* Instant Category Chips */}
      <div className="mt-4 flex flex-wrap gap-2.5 items-center">
        <span className="text-[9px] font-bold text-muted uppercase tracking-widest mr-1">
          Quick links:
        </span>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1.5 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 shadow-sm"
        >
          <Briefcase className="h-3.5 w-3.5" />
          <span>Jobs</span>
        </Link>
        <Link
          href="/categories/scholarships"
          className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/20 bg-pink-500/5 px-3.5 py-1.5 text-[11px] font-extrabold text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 transition-all duration-200 shadow-sm"
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Scholarships</span>
        </Link>
        <Link
          href="/institutions"
          className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 px-3.5 py-1.5 text-[11px] font-extrabold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-all duration-200 shadow-sm"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Universities</span>
        </Link>
        <Link
          href="/categories/results"
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3.5 py-1.5 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 shadow-sm"
        >
          <Trophy className="h-3.5 w-3.5" />
          <span>Results</span>
        </Link>
        <Link
          href="/categories/admissions"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3.5 py-1.5 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-all duration-200 shadow-sm"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          <span>Admissions</span>
        </Link>
      </div>
    </form>
  );
}
