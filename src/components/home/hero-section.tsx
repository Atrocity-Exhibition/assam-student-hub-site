import Link from "next/link";
import { getNotices } from "@/services/notices";
import { HeroText } from "@/components/shared/hero-text";

const quickLinks = [
  "Government Jobs",
  "Scholarships",
  "Admissions",
  "Exam Routines",
  "Results",
  "Universities",
];

export async function HeroSection() {
  const { notices } = await getNotices({ page: 1, sort: "latest" });
  const latestNotices = notices.slice(0, 3);

  return (
    <section className="border-b border-zinc-900">
      <div className="py-20">
        <div className="flex min-h-[58vh] items-center">
          <div className="max-w-4xl w-full">
            {/* TAG */}
            <div className="mb-6 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1 text-sm text-zinc-400">
              Assam jobs, scholarships & student updates
            </div>

            {/* HEADING */}
            <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">
              <div>Discover</div>
              <div className="mt-2">
                <HeroText />
              </div>
              <div className="mt-2">Across Assam</div>
            </h1>

            {/* SUBTITLE */}
            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
              Search official Assam government jobs, university notices, scholarships,
              admissions, exam updates, and student opportunities in one place.
            </p>

            {/* SEARCH */}
            <div className="mt-12 max-w-2xl">
              <div className="relative overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/80 p-1 shadow-[0_0_80px_rgba(239,68,68,0.05)]">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search jobs, scholarships, universities..."
                    className="h-14 w-full bg-transparent px-6 text-base text-white outline-none placeholder:text-zinc-500"
                  />
                  <button className="mr-2 rounded-full bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-400">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE ANNOUNCEMENTS FEED */}
            <div className="mt-8 max-w-2xl rounded-3xl border border-zinc-800/85 bg-zinc-900/25 backdrop-blur-md p-6 shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Live Announcements Feed
                </h3>
              </div>
              <div className="space-y-3">
                {latestNotices.length === 0 ? (
                  <p className="text-sm text-zinc-500 p-2">No active notices available.</p>
                ) : (
                  latestNotices.map((notice) => (
                    <Link
                      key={notice.id}
                      href={`/notices/${notice.slug}`}
                      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-zinc-900 bg-zinc-950/15 p-3.5 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/30"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-200 line-clamp-1 group-hover:text-red-400 transition-colors duration-200">
                          {notice.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                          <span>{notice.source}</span>
                          <span>•</span>
                          <span className="capitalize">{notice.category || "Notice"}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-900/60 px-3 py-1 rounded-full shrink-0 group-hover:text-zinc-300 group-hover:bg-zinc-800/80 transition-all duration-200">
                        {notice.posted_at
                          ? new Date(notice.posted_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : new Date(notice.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="mt-10 flex flex-wrap gap-3">
              {quickLinks.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-300 transition hover:border-red-500/40 hover:bg-zinc-800 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

