import { supabase } from "@/lib/supabase";
import type { Notice } from "@/types/notice";
import { logSearch } from "./search-analytics";

type GetNoticesOptions = {
  search?: string;
  category?: string;
  page?: number;
  sort?: string;
  institutionSlug?: string;
  institutionId?: number;
  userId?: string | null;
};

const PAGE_SIZE = 6;

// Minimum query length to attempt Full Text Search
// Queries shorter than this fall through directly to ilike
const FTS_MIN_LENGTH = 2;

export async function getNotices(options?: GetNoticesOptions) {
  const page = options?.page || 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const search = options?.search?.trim() || "";
  const category = options?.category && options.category !== "All" ? options.category : undefined;

  // ──────────────────────────────────────────────────────────────────────
  // SEARCH PATH: FTS → Fuzzy fallback → ilike fallback
  // ──────────────────────────────────────────────────────────────────────
  if (search.length >= FTS_MIN_LENGTH) {
    const t0 = Date.now();

    // ---- Primary: PostgreSQL Full Text Search (ranked by relevance × recency) ----
    try {
      const { data: ftsData, error: ftsError } = await supabase.rpc("search_notices", {
        search_query: search,
        p_category: category ?? null,
        p_page: page,
        p_page_size: PAGE_SIZE,
      });

      const durationMs = Date.now() - t0;

      if (!ftsError && ftsData && ftsData.length > 0) {
        // Fetch institution details for matching notices (RPC doesn't join)
        const ids = ftsData.map((n: any) => n.id);
        const { data: instData } = await supabase
          .from("notices")
          .select("id, institutions(*)")
          .in("id", ids);
        const instMap: Record<number, any> = {};
        instData?.forEach((row: any) => { instMap[row.id] = row.institutions; });

        const notices = ftsData.map((n: any) => ({
          ...n,
          institutions: instMap[n.id] ?? null,
        })) as Notice[];

        // Fire-and-forget analytics log
        logSearch({ query: search, resultsCount: notices.length, searchType: "fts", durationMs, category, userId: options?.userId });

        // For FTS results we can't do a cheap exact count — return results + signal
        return { notices, totalPages: notices.length === PAGE_SIZE ? page + 1 : page };
      }
    } catch {
      // FTS failed (e.g. migration not yet run) — fall through to ilike
    }

    // ---- Fuzzy fallback: trigram word_similarity (catches typos) ----
    try {
      const { data: fuzzyData, error: fuzzyError } = await supabase.rpc("fuzzy_search_notices", {
        search_query: search,
        p_category: category ?? null,
        p_threshold: 0.25,
        p_page_size: PAGE_SIZE,
      });

      const durationMs = Date.now() - t0;

      if (!fuzzyError && fuzzyData && fuzzyData.length > 0) {
        const ids = fuzzyData.map((n: any) => n.id);
        const { data: instData } = await supabase
          .from("notices")
          .select("id, institutions(*)")
          .in("id", ids);
        const instMap: Record<number, any> = {};
        instData?.forEach((row: any) => { instMap[row.id] = row.institutions; });

        const notices = fuzzyData.map((n: any) => ({
          ...n,
          institutions: instMap[n.id] ?? null,
        })) as Notice[];

        logSearch({ query: search, resultsCount: notices.length, searchType: "fuzzy", durationMs, category, userId: options?.userId });

        return { notices, totalPages: 1, wasFuzzyFallback: true };
      }
    } catch {
      // Fuzzy failed (pg_trgm not yet enabled) — fall through to ilike
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  // FALLBACK PATH: Standard ilike query (used for short queries or if
  // both FTS and fuzzy fail — e.g. migration not yet run)
  // ──────────────────────────────────────────────────────────────────────
  const t0Fallback = Date.now();

  let query = supabase
    .from("notices")
    .select("*, institutions(*)", { count: "exact" })
    .range(from, to)
    .eq("is_active", true);

  if (search.length > 0) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%,source.ilike.%${search}%,institution.ilike.%${search}%`
    );
  }

  if (category) {
    query = query.ilike("category", category);
  }

  if (options?.institutionSlug) {
    query = query.eq("institution_slug", options.institutionSlug);
  }
  if (options?.institutionId) {
    query = query.eq("institution_id", options.institutionId);
  }

  switch (options?.sort) {
    case "oldest":
      query = query.order("posted_at", { ascending: true, nullsFirst: false });
      break;
    case "alphabetical":
      query = query.order("title", { ascending: true });
      break;
    case "latest":
    default:
      query = query.order("posted_at", { ascending: false, nullsFirst: false });
  }

  const { data, error, count } = await query;
  const durationFallback = Date.now() - t0Fallback;

  if (error) {
    console.error("Error in getNotices:", error);
    return { notices: [], totalPages: 1 };
  }

  const notices = (data as Notice[]) || [];

  if (search.length >= FTS_MIN_LENGTH) {
    logSearch({ query: search, resultsCount: notices.length, searchType: "ilike", durationMs: durationFallback, category, userId: options?.userId });
  }

  return {
    notices,
    totalPages: Math.max(1, Math.ceil((count || 0) / PAGE_SIZE)),
  };
}

export async function getNoticeBySlug(slug: string): Promise<Notice | null> {
  const { data, error } = await supabase
    .from("notices")
    .select("*, institutions(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error in getNoticeBySlug:", error);
    return null;
  }

  return data as Notice;
}

export async function getNoticesByInstitution(
  institutionId: number,
  limit?: number
): Promise<Notice[]> {
  let query = supabase
    .from("notices")
    .select("*")
    .eq("institution_id", institutionId)
    .eq("is_active", true)
    .order("posted_at", { ascending: false, nullsFirst: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error in getNoticesByInstitution:", error);
    return [];
  }

  return (data as Notice[]) || [];
}

/**
 * Fetches related notices for a given notice using trigram similarity on title
 * plus institution/category matching — used in the notice detail sidebar.
 */
export async function getRelatedNotices(
  noticeId: number,
  title: string,
  institutionId: number | null,
  category: string,
  limit: number = 4
): Promise<Notice[]> {
  try {
    // Same institution OR same category, ordered by word_similarity to current title
    const { data: fuzzyData, error } = await supabase.rpc("fuzzy_search_notices", {
      search_query: title,
      p_category: null, // Don't restrict by category — want cross-category relatedness too
      p_threshold: 0.1, // Low threshold for related content (less strict than typo correction)
      p_page_size: limit + 1, // Fetch one extra to account for filtering out current notice
    });

    if (error || !fuzzyData) {
      // Fallback: simple category + institution query
      const { data: fallbackData } = await supabase
        .from("notices")
        .select("id, title, slug, category, institution, source, posted_at, created_at")
        .eq("is_active", true)
        .neq("id", noticeId)
        .or(`institution_id.eq.${institutionId ?? 0},category.eq.${category}`)
        .order("posted_at", { ascending: false, nullsFirst: false })
        .limit(limit);
      return (fallbackData as Notice[]) || [];
    }

    return fuzzyData
      .filter((n: any) => n.id !== noticeId)
      .slice(0, limit) as Notice[];
  } catch {
    return [];
  }
}
