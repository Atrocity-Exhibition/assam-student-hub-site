"use client";

import { useRouter } from "next/navigation";
import { CustomSort } from "../shared/custom-sort";

type Props = {
  currentSort?: string;

  search?: string;

  category?: string;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "alphabetical", label: "A-Z" },
];

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
    <CustomSort
      options={SORT_OPTIONS}
      value={currentSort || "newest"}
      onChange={handleChange}
    />
  );
}
