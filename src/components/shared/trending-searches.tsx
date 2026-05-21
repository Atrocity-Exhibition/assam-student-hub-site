import Link from "next/link";
import { getTrendingSearches } from "@/services/search-analytics";

// Cache trending searches for 30 minutes — fresh enough to feel live,
// cheap enough not to hammer the DB on every page render.
export const revalidate = 1800;

export async function TrendingSearches() {
  const trends = await getTrendingSearches(8);

  // Don't render anything if there's not enough real data yet
  if (trends.length < 3) return null;

  return (
    <div className="mt-8">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
        🔍 Trending searches
      </p>
      <div className="flex flex-wrap gap-2">
        {trends.map((query) => (
          <Link
            key={query}
            href={`/notices?search=${encodeURIComponent(query)}`}
            className="rounded-full border border-zinc-800 bg-zinc-900/30 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-zinc-200 capitalize"
          >
            {query}
          </Link>
        ))}
      </div>
    </div>
  );
}
