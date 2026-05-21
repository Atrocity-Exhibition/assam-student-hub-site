"use client";

import { useState } from "react";
import { saveSearchAction } from "@/app/saved-searches/actions";

type Props = {
  query: string;
  category?: string | null;
  isAuthenticated: boolean;
};

export function SaveSearchButton({ query, category, isAuthenticated }: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <a
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-500 transition-all duration-200 hover:border-zinc-700 hover:text-zinc-400"
      >
        ☆ Save this search
      </a>
    );
  }

  if (saved) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-900/60 bg-green-900/20 px-4 py-1.5 text-xs font-medium text-green-400">
        ★ Search saved
      </span>
    );
  }

  async function handleSave() {
    setLoading(true);
    const result = await saveSearchAction(query, category);
    if (result.success) {
      setSaved(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-400 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Saving…" : "☆ Save this search"}
    </button>
  );
}
