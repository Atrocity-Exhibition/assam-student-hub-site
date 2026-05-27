import Link from "next/link";
import { getTrendingSearches } from "@/services/search-analytics";

// Cache trending searches for 30 minutes — fresh enough to feel live,
// cheap enough not to hammer the DB on every page render.
export const revalidate = 1800;

export async function TrendingSearches() {
  const trends = await getTrendingSearches(8);

  const displayTrends = trends.length >= 3 ? trends : [
    "APSC Recruitment",
    "Gauhati University Exam",
    "Dibrugarh University",
    "Assam Police SI",
    "Admissions 2026",
    "Scholarships",
    "TET Assam",
    "Results"
  ];

  return (
    <div className="mt-8">
      <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">
        Trending Searches:
      </p>
      <div className="flex flex-wrap gap-2">
        {displayTrends.map((query) => (
          <Link
            key={query}
            href={`/jobs?search=${encodeURIComponent(query)}`}
            className="rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-sm transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-card hover:text-foreground capitalize"
          >
            {query}
          </Link>
        ))}
      </div>
    </div>
  );
}
