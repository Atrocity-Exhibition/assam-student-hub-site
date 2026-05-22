"use client";

import { useRouter } from "next/navigation";

type Props = {
  currentSort?: string;
  search?: string;
  category?: string;
};

export function NoticesSort({ currentSort, search, category }: Props) {
  const router = useRouter();

  function handleChange(value: string) {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (category && category !== "All") {
      params.set("category", category);
    }

    if (value !== "newest") {
      params.set("sort", value);
    }

    router.push(`/notices?${params.toString()}`);
  }

  return (
    <select
      value={currentSort || "newest"}
      onChange={(event) => handleChange(event.target.value)}
      className="h-12 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30 px-4 text-sm text-zinc-700 dark:text-zinc-300 outline-none transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700/80 cursor-pointer"
    >
      <option value="newest">Latest Posted</option>
      <option value="oldest">Oldest Posted</option>
      <option value="alphabetical">A-Z Title</option>
    </select>
  );
}
