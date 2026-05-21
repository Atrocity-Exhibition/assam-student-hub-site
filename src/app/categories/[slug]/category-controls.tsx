"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchProps = {
  initialSearch?: string;
  categorySlug: string;
};

export function CategorySearch({ initialSearch = "", categorySlug }: SearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    router.push(`/categories/${categorySlug}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm p-2 shadow-xl focus-within:border-zinc-700/80 transition-all duration-300"
    >
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search within this category..."
          className="h-12 w-full bg-transparent px-4 text-white outline-none placeholder:text-zinc-500 text-sm"
        />

        <button
          type="submit"
          className="rounded-2xl bg-red-500 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-red-400 active:scale-95 shadow-md shadow-red-500/10"
        >
          Search
        </button>
      </div>
    </form>
  );
}

type SortProps = {
  currentSort?: string;
  search?: string;
  categorySlug: string;
};

export function CategorySort({ currentSort, search, categorySlug }: SortProps) {
  const router = useRouter();

  function handleChange(value: string) {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (value !== "newest") {
      params.set("sort", value);
    }

    router.push(`/categories/${categorySlug}?${params.toString()}`);
  }

  return (
    <select
      value={currentSort || "newest"}
      onChange={(event) => handleChange(event.target.value)}
      className="h-12 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm px-4 text-sm text-zinc-300 outline-none transition-all duration-300 hover:border-zinc-700/80 cursor-pointer"
    >
      <option value="newest">Latest Posted</option>
      <option value="oldest">Oldest Posted</option>
      <option value="alphabetical">A-Z Title</option>
    </select>
  );
}
