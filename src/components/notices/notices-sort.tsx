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
      className="h-12 rounded-2xl border border-border bg-card/45 px-4 text-sm text-foreground outline-none transition-all duration-200 hover:border-zinc-350 dark:hover:border-zinc-700 cursor-pointer focus-visible:border-brand-border focus-visible:ring-2 focus-visible:ring-brand/15 dark:focus-visible:ring-brand/20"
    >
      <option value="newest">Latest Posted</option>
      <option value="oldest">Oldest Posted</option>
      <option value="alphabetical">A-Z Title</option>
    </select>
  );
}
