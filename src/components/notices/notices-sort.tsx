"use client";

import { useRouter } from "next/navigation";
import { CustomSort } from "../shared/custom-sort";

type Props = {
  currentSort?: string;
  search?: string;
  category?: string;
  basePath?: string;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Latest Posted" },
  { value: "oldest", label: "Oldest Posted" },
  { value: "alphabetical", label: "A-Z Title" },
];

export function NoticesSort({ currentSort, search, category, basePath }: Props) {
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

    const path = basePath || "/jobs";
    router.push(`${path}?${params.toString()}`);
  }

  return (
    <CustomSort
      options={SORT_OPTIONS}
      value={currentSort || "newest"}
      onChange={handleChange}
    />
  );
}
