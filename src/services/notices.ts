import { supabase } from "@/lib/supabase";
import type { Notice } from "@/types/notice";
import { logSearch } from "./search-analytics";

export const EXCLUDED_ACADEMIC_SLUGS = [
  "gauhati-university",
  "cotton-university",
  "dibrugarh-university",
  "tezpur-university",
  "bodoland-university",
  "mangaldai-college",
  "assam-university",
  "astu",
  "krishna-kanta-handiqui-state-open-university",
  "assam-womens-university",
];

export const NON_ACADEMIC_SLUGS = [
  "assam-public-service-commission",
  "state-level-police-recruitment-board",
  "gauhati-high-court",
  "all-job-assam",
  "numaligarh-refinery-limited",
  "assamjobnews",
  "daily-assam-job",
  "assam-career",
  "ncs-portal",
  "aesrb",
  "nhm-assam",
  "seba",
  "ahsec",
];

/**
 * Checks if a category is a competitive exam/result category that requires partitioning academic notices.
 */
export function isCompetitiveCategory(category?: string | null): boolean {
  if (!category) return false;
  const catLower = category.toLowerCase();
  return catLower === "exam" || catLower === "result";
}

/**
 * Applies the competitive exam query filter to a PostgREST query.
 * If the category is competitive and no specific institution is requested,
 * it excludes university academic notices.
 */
export function applyCompetitiveExamFilters<T>(
  query: T,
  category?: string,
  options?: { institutionSlug?: string; institutionId?: number }
): T {
  if (isCompetitiveCategory(category) && !options?.institutionSlug && !options?.institutionId) {
    return (query as unknown as { not: (col: string, op: string, val: string) => T })
      .not("institution_slug", "in", `("${EXCLUDED_ACADEMIC_SLUGS.join('","')}")`);
  }
  return query;
}

/**
 * Applies the competitive exam filter to in-memory notices array (useful for RPC results).
 */
export function filterCompetitiveExamNotices(
  notices: Notice[],
  category?: string,
  options?: { institutionSlug?: string; institutionId?: number }
): Notice[] {
  if (isCompetitiveCategory(category) && !options?.institutionSlug && !options?.institutionId) {
    return notices.filter(
      (n) => !n.institution_slug || !EXCLUDED_ACADEMIC_SLUGS.includes(n.institution_slug)
    );
  }
  return notices;
}

type GetNoticesOptions = {
  search?: string;
  category?: string;
  page?: number;
  sort?: string;
  institutionSlug?: string;
  institutionId?: number;
  userId?: string | null;
  excludeId?: number;
  isOfficial?: boolean;
  dateRange?: string;
};

const PAGE_SIZE = 12;

// Minimum query length to attempt Full Text Search
// Queries shorter than this fall through directly to ilike
const FTS_MIN_LENGTH = 2;

export async function getNotices(options?: GetNoticesOptions) {
  const page = options?.page || 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const search = options?.search?.trim() || "";
  const category = options?.category && options.category !== "All" ? options.category : undefined;
  const rpcCategory = category === "academic" ? null : (category ?? null);

  // ──────────────────────────────────────────────────────────────────────
  // SEARCH PATH: FTS → Fuzzy fallback → ilike fallback
  // ──────────────────────────────────────────────────────────────────────
  const hasFilters = options?.isOfficial !== undefined || options?.dateRange || options?.institutionSlug || options?.institutionId;

  if (search.length >= FTS_MIN_LENGTH && !hasFilters) {
    const t0 = Date.now();

    // ---- Primary: PostgreSQL Full Text Search (ranked by relevance × recency) ----
    try {
      const { data: ftsData, error: ftsError } = await supabase.rpc("search_notices", {
        search_query: search,
        p_category: rpcCategory,
        p_page: page,
        p_page_size: PAGE_SIZE,
      });

      const durationMs = Date.now() - t0;

      if (!ftsError && ftsData && ftsData.length > 0) {
        // Fetch institution details for matching notices (RPC doesn't join)
        const ids = (ftsData as { id: number }[]).map((n) => n.id);
        const { data: instData } = await supabase
          .from("notices")
          .select("id, institutions(*)")
          .in("id", ids);
        const instMap: Record<number, Notice["institutions"]> = {};
        (instData as unknown as { id: number; institutions: Notice["institutions"] }[] | null)?.forEach((row) => {
          instMap[row.id] = row.institutions;
        });

        let notices = (ftsData as Notice[]).map((n) => ({
          ...n,
          institutions: instMap[n.id] ?? null,
        })) as Notice[];

        if (options?.excludeId) {
          notices = notices.filter((n) => n.id !== options.excludeId);
        }
        if (options?.category === "academic") {
          notices = notices.filter(
            (n) =>
              n.category?.toLowerCase() !== "recruitment" &&
              (!n.institution_slug || !NON_ACADEMIC_SLUGS.includes(n.institution_slug))
          );
        }
        notices = filterCompetitiveExamNotices(notices, category, options);

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
        p_category: rpcCategory,
        p_threshold: 0.25,
        p_page_size: PAGE_SIZE,
      });

      const durationMs = Date.now() - t0;

      if (!fuzzyError && fuzzyData && fuzzyData.length > 0) {
        const ids = (fuzzyData as { id: number }[]).map((n) => n.id);
        const { data: instData } = await supabase
          .from("notices")
          .select("id, institutions(*)")
          .in("id", ids);
        const instMap: Record<number, Notice["institutions"]> = {};
        (instData as unknown as { id: number; institutions: Notice["institutions"] }[] | null)?.forEach((row) => {
          instMap[row.id] = row.institutions;
        });

        let notices = (fuzzyData as Notice[]).map((n) => ({
          ...n,
          institutions: instMap[n.id] ?? null,
        })) as Notice[];

        if (options?.excludeId) {
          notices = notices.filter((n) => n.id !== options.excludeId);
        }
        if (options?.category === "academic") {
          notices = notices.filter(
            (n) =>
              n.category?.toLowerCase() !== "recruitment" &&
              (!n.institution_slug || !NON_ACADEMIC_SLUGS.includes(n.institution_slug))
          );
        }
        notices = filterCompetitiveExamNotices(notices, category, options);

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
    if (category === "academic") {
      query = query
        .neq("category", "recruitment")
        .or(`institution_slug.not.in.("${NON_ACADEMIC_SLUGS.join('","')}"),institution_slug.is.null`);
    } else {
      query = query.ilike("category", category);
    }
  }

  if (options?.excludeId) {
    query = query.neq("id", options.excludeId);
  }

  query = applyCompetitiveExamFilters(query, category, options);

  if (options?.institutionSlug) {
    query = query.eq("institution_slug", options.institutionSlug);
  }
  if (options?.institutionId) {
    query = query.eq("institution_id", options.institutionId);
  }

  if (options?.isOfficial !== undefined) {
    query = query.eq("is_official", options.isOfficial);
  }

  if (options?.dateRange) {
    const cutoff = new Date();
    if (options.dateRange === "24h") {
      cutoff.setHours(cutoff.getHours() - 24);
      query = query.gte("posted_at", cutoff.toISOString());
    } else if (options.dateRange === "7days") {
      cutoff.setDate(cutoff.getDate() - 7);
      query = query.gte("posted_at", cutoff.toISOString());
    } else if (options.dateRange === "30days") {
      cutoff.setDate(cutoff.getDate() - 30);
      query = query.gte("posted_at", cutoff.toISOString());
    }
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
    if (error.code === "PGRST103") {
      const match = error.details?.match(/there are only (\d+) rows/);
      const totalRows = match ? parseInt(match[1], 10) : 0;
      const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
      return { notices: [], totalPages };
    }
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

    return (fuzzyData as { id: number }[])
      .filter((n) => n.id !== noticeId)
      .slice(0, limit) as unknown as Notice[];
  } catch {
    return [];
  }
}

export async function getPlatformStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      { count: activeNotices },
      { count: institutionsCount },
      { count: recruitmentsCount },
      { count: updatedTodayCount }
    ] = await Promise.all([
      // Active Notices
      supabase
        .from("notices")
        .select("*", { head: true, count: "exact" })
        .eq("is_active", true)
        .is("merged_into_notice_id", null),
      // Institutions
      supabase
        .from("institutions")
        .select("*", { head: true, count: "exact" }),
      // Recruitments
      supabase
        .from("notices")
        .select("*", { head: true, count: "exact" })
        .eq("is_active", true)
        .is("merged_into_notice_id", null)
        .eq("category", "recruitment"),
      // Updated Today (created since midnight today)
      supabase
        .from("notices")
        .select("*", { head: true, count: "exact" })
        .eq("is_active", true)
        .is("merged_into_notice_id", null)
        .gte("created_at", today.toISOString())
    ]);

    return {
      activeNotices: activeNotices || 0,
      institutions: institutionsCount || 0,
      recruitments: recruitmentsCount || 0,
      updatedToday: updatedTodayCount || 0,
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return {
      activeNotices: 0,
      institutions: 0,
      recruitments: 0,
      updatedToday: 0,
    };
  }
}

export async function getAcademicNotices(limit: number = 5): Promise<Notice[]> {
  const { data, error } = await supabase
    .from("notices")
    .select("*, institutions(*)")
    .eq("is_active", true)
    .is("merged_into_notice_id", null)
    .neq("category", "recruitment")
    .or(`institution_slug.not.in.("${NON_ACADEMIC_SLUGS.join('","')}"),institution_slug.is.null`)
    .order("posted_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error in getAcademicNotices:", error);
    return [];
  }

  return (data as Notice[]) || [];
}

export async function getRecentNotices(limit: number = 5): Promise<Notice[]> {
  const { data, error } = await supabase
    .from("notices")
    .select("*, institutions(*)")
    .eq("is_active", true)
    .is("merged_into_notice_id", null)
    .order("posted_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("Error in getRecentNotices:", error);
    return [];
  }

  return (data as Notice[]) || [];
}


export async function getImportantNotice(categoryType: "job" | "academic"): Promise<Notice | null> {
  let query = supabase
    .from("notices")
    .select("*, institutions(*)")
    .eq("is_active", true)
    .is("merged_into_notice_id", null)
    .contains("tags", ["important"]);

  if (categoryType === "job") {
    query = query.eq("category", "recruitment");
  } else {
    query = query.neq("category", "recruitment");
  }

  const { data, error } = await query
    .order("posted_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error in getImportantNotice:", error);
    return null;
  }

  return data as Notice;
}
