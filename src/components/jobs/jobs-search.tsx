"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

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
      className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-3"
    >
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="Search jobs..."
          className="h-14 w-full bg-transparent px-4 text-white outline-none placeholder:text-zinc-500"
        />

        <button
          type="submit"
          className="rounded-2xl bg-red-500 px-6 font-medium text-white transition hover:bg-red-400"
        >
          Search
        </button>
      </div>
    </form>
  );
}
