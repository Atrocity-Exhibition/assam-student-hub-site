"use client";

import { useRouter } from "next/navigation";

type Props = {
  currentSort?: string;

  search?: string;

  category?: string;
};

export function JobsSort({
  currentSort,
  search,
  category,
}: Props) {
  const router = useRouter();

  function handleChange(
    value: string,
  ) {
    const params =
      new URLSearchParams();

    if (search) {
      params.set(
        "search",
        search,
      );
    }

    if (
      category &&
      category !== "All"
    ) {
      params.set(
        "category",
        category,
      );
    }

    if (value !== "newest") {
      params.set(
        "sort",
        value,
      );
    }

    router.push(
      `/jobs?${params.toString()}`,
    );
  }

  return (
    <select
      value={
        currentSort || "newest"
      }
      onChange={(event) =>
        handleChange(
          event.target.value,
        )
      }
      className="h-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-zinc-300 outline-none transition hover:border-red-500/40"
    >
      <option value="newest">
        Newest
      </option>

      <option value="oldest">
        Oldest
      </option>

      <option value="alphabetical">
        A-Z
      </option>
    </select>
  );
}
