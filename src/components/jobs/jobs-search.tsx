"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  initialSearch?: string;
};

export function JobsSearch({
  initialSearch = "",
}: Props) {
  const router = useRouter();

  const [search, setSearch] =
    useState(initialSearch);

  function handleSearch(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const params =
      new URLSearchParams();

    if (search.trim()) {
      params.set(
        "search",
        search,
      );
    }

    router.push(
      `/jobs?${params.toString()}`,
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="relative rounded-3xl border border-border bg-card/50 p-1.5 focus-within:border-brand-border focus-within:ring-2 focus-within:ring-brand/15 dark:focus-within:ring-brand/20 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="Search jobs..."
          className="h-12 w-full bg-transparent px-4 text-foreground outline-none placeholder:text-muted/65 text-sm sm:text-base"
        />

        <Button
          type="submit"
          variant="primary"
          className="px-6 py-3 text-sm font-semibold shrink-0"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
