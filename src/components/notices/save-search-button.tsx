"use client";

import { useState } from "react";
import { saveSearchAction } from "@/app/saved-searches/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:border-zinc-350 dark:hover:border-zinc-700 hover:text-foreground"
      >
        ☆ Save this search
      </a>
    );
  }

  if (saved) {
    return (
      <Badge variant="brand" className="gap-1.5 px-4 py-1.5">
        ★ Search saved
      </Badge>
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
    <Button
      onClick={handleSave}
      disabled={loading}
      variant="secondary"
      size="sm"
      className="gap-1.5"
    >
      {loading ? "Saving…" : "☆ Save this search"}
    </Button>
  );
}
