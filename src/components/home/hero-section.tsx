import { getPlatformStats, getRecentNotices } from "@/services/notices";
import { HeroSearch } from "./hero-search";
import { TrendingSearches } from "@/components/shared/trending-searches";
import Link from "next/link";
import { FileText, Building2, Briefcase, Calendar } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";
import { InstitutionLogo } from "@/components/shared/institution-logo";


export async function HeroSection() {
  const stats = await getPlatformStats();
  const recentNotices = await getRecentNotices(4);

  const statItems = [
    {
      label: "Active Notices",
      value: stats.activeNotices.toLocaleString(),
      icon: FileText,
      color: "text-blue-400 border-blue-500/10 bg-blue-500/5",
      delay: "100ms",
    },
    {
      label: "Verified Institutions",
      value: stats.institutions.toLocaleString(),
      icon: Building2,
      color: "text-emerald-400 border-emerald-500/10 bg-emerald-500/5",
      delay: "200ms",
    },
    {
      label: "Live Jobs",
      value: stats.recruitments.toLocaleString(),
      icon: Briefcase,
      color: "text-amber-400 border-amber-500/10 bg-amber-500/5",
      delay: "300ms",
    },
    {
      label: "Updates Today",
      value: stats.updatedToday.toLocaleString(),
      icon: Calendar,
      color: "text-purple-400 border-purple-500/10 bg-purple-500/5",
      delay: "400ms",
    },
  ];

  return (
    <section className="border-b border-zinc-200/80 dark:border-zinc-900/60 pb-12 pt-8 sm:pt-16 transition-colors duration-200">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* Left Side: Hero Info & Search */}
        <div className="w-full">
          {/* TAG */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Assam jobs, scholarships & student updates
          </div>

          {/* HEADING */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black leading-[1.15] tracking-tight text-zinc-900 dark:text-zinc-100 max-w-4xl transition-colors duration-200">
            Assam&apos;s Unified Academic Notice Portal
          </h1>

          {/* SUBTITLE */}
          <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 transition-colors duration-200">
            Search official Assam government jobs, university notices, scholarships,
            admissions, exam updates, and student opportunities in one place.
          </p>

          {/* SEARCH */}
          <div className="mt-6 max-w-3xl">
            <HeroSearch />
          </div>

          {/* TRENDING / FALLBACK SEARCHES */}
          <div className="max-w-3xl">
            <TrendingSearches />
          </div>
        </div>

        {/* Right Side: Live Activity Dashboard Card */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/40 dark:border-zinc-900/60 dark:bg-zinc-950/20 p-5 backdrop-blur-md shadow-lg w-full lg:mt-2 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3.5 mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Dashboard
            </h3>
            <span className="text-[9px] font-bold text-muted uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded">
              Activity Stats
            </span>
          </div>

          {/* Stats tight 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {statItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-200 bg-white/60 dark:border-zinc-900/60 dark:bg-zinc-900/10 p-3 shadow-sm hover:bg-white/90 dark:hover:bg-zinc-900/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-1.5 border shrink-0 ${item.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider truncate">
                      {item.label.split(" ")[0]}
                    </span>
                  </div>
                  <p className="mt-1.5 text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Latest Updates notice list feed */}
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2.5">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted">
                Latest Updates
              </h4>
              <Link href="/browse" className="text-[9px] font-bold uppercase tracking-wider text-brand hover:underline">
                View All
              </Link>
            </div>
            
            <div className="divide-y divide-border/40 animate-fade-in">
              {recentNotices.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted">
                  No recent updates.
                </div>
              ) : (
                recentNotices.map((notice) => {
                  const relativeTime = getRelativeTime(notice.posted_at || notice.created_at);
                  const isRecruitment = notice.category?.toLowerCase() === "recruitment";
                  const categoryStyle = isRecruitment
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                    : "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400";
                  
                  return (
                    <Link
                      key={notice.id}
                      href={`/jobs/${notice.slug}`}
                      className="group flex gap-3 py-2.5 hover:bg-zinc-200/20 dark:hover:bg-zinc-900/20 transition-colors rounded px-2 -mx-2 items-start"
                    >
                      <InstitutionLogo logoUrl={notice.institutions?.logo_url} name={notice.institutions?.name || notice.source} className="h-7 w-7 text-[10px] mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`inline-flex rounded-md border px-1.5 py-0.2 text-[8px] font-extrabold uppercase tracking-wider ${categoryStyle}`}>
                            {notice.category || "Notice"}
                          </span>
                          <span className="text-[8px] text-muted font-semibold tracking-wider shrink-0 uppercase">
                            {relativeTime}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold leading-snug text-zinc-800 dark:text-zinc-200 line-clamp-1 group-hover:text-emerald-500 transition-colors">
                          {notice.title}
                        </p>
                        {notice.institutions?.name && (
                          <span className="text-[8px] text-muted uppercase tracking-wider font-bold truncate mt-0.5 block">
                            {notice.institutions.name}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

