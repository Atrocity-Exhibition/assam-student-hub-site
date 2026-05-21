import { supabase } from "@/lib/supabase";

type SearchType = "fts" | "fuzzy" | "ilike";

type LogSearchOptions = {
  query: string;
  resultsCount: number;
  searchType?: SearchType;
  durationMs?: number;
  category?: string;
  userId?: string | null;
};

/**
 * Fire-and-forget analytics logger.
 * Inserts a row into search_logs without blocking the calling render path.
 * Silently swallows all errors — analytics must never break search UX.
 */
export async function logSearch({
  query,
  resultsCount,
  searchType = "fts",
  durationMs,
  category,
  userId,
}: LogSearchOptions): Promise<void> {
  // Minimum quality filter: skip trivially short queries and whitespace-only strings
  const normalized = query.trim();
  if (normalized.length < 2) return;

  try {
    await supabase.from("search_logs").insert({
      query: normalized,
      results_count: resultsCount,
      search_type: searchType,
      search_duration_ms: durationMs ?? null,
      category: category ?? null,
      user_id: userId ?? null,
    });
  } catch {
    // Swallow silently — analytics must never surface errors to users
  }
}

/**
 * Fetches the top trending search queries from the past 7 days.
 * Applies quality filters:
 *   - Minimum 2 occurrences (eliminates one-off garbage)
 *   - Only queries that returned results (eliminates failed/empty searches)
 *   - Minimum 2 character length
 */
export async function getTrendingSearches(limit: number = 8): Promise<string[]> {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("search_logs")
      .select("query")
      .gte("created_at", sevenDaysAgo)
      .gt("results_count", 0)
      .gte("results_count", 1);

    if (error || !data) return [];

    // Aggregate counts client-side (Supabase anon client can't use GROUP BY directly)
    const counts: Record<string, number> = {};
    for (const row of data) {
      const q = row.query.toLowerCase().trim();
      if (q.length >= 2) {
        counts[q] = (counts[q] || 0) + 1;
      }
    }

    return Object.entries(counts)
      .filter(([, count]) => count >= 2) // Minimum 2 occurrences
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query]) => query);
  } catch {
    return [];
  }
}
