"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

type Props = {
  initialSearch?: string;
};

export function NoticesSearch({ initialSearch = "" }: Props) {
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

    router.push(`/notices?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="relative rounded-3xl border border-zinc-200 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-950/40 p-1.5 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_25px_rgba(16,185,129,0.06)] dark:focus-within:shadow-[0_0_25px_rgba(16,185,129,0.08)] transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <Search className="ml-3 h-5 w-5 text-zinc-500 dark:text-zinc-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notices, exams, recruitment..."
          className="h-12 w-full bg-transparent px-1 text-zinc-900 dark:text-white outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-500 text-sm"
        />

        {/* Keyboard shortcut indicator */}
        <div className="mr-3 hidden sm:flex items-center pointer-events-none shrink-0">
          <kbd className="h-5 px-1.5 flex items-center justify-center rounded border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 text-[10px] font-medium text-zinc-500 font-mono">
            /
          </kbd>
        </div>

        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-95 active:scale-[0.98] shadow-md shadow-emerald-500/10 shrink-0"
        >
          Search
        </button>
      </div>
    </form>
  );
}
