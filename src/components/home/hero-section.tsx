import { getPlatformStats } from "@/services/notices";
import { HeroSearch } from "./hero-search";
import { TrendingSearches } from "@/components/shared/trending-searches";
import Link from "next/link";
import { FileText, Building2, Briefcase, Calendar } from "lucide-react";

const quickLinks = [
  { name: "Government Jobs", href: "/categories/recruitment" },
  { name: "Scholarships", href: "/categories/scholarships" },
  { name: "Admissions", href: "/categories/admissions" },
  { name: "Exam Routines", href: "/categories/exams" },
  { name: "Results", href: "/categories/results" },
  { name: "Universities", href: "/notices" },
];

export async function HeroSection() {
  const stats = await getPlatformStats();

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
      label: "Live Recruitments",
      value: stats.recruitments.toLocaleString(),
      icon: Briefcase,
      color: "text-amber-400 border-amber-500/10 bg-amber-500/5",
      delay: "300ms",
    },
    {
      label: "Updated Today",
      value: stats.updatedToday.toLocaleString(),
      icon: Calendar,
      color: "text-purple-400 border-purple-500/10 bg-purple-500/5",
      delay: "400ms",
    },
  ];

  return (
    <section className="border-b border-zinc-200/80 dark:border-zinc-900/60 pb-10 pt-12 transition-colors duration-200">
      <div className="max-w-5xl w-full">
        {/* TAG */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Assam jobs, scholarships & student updates
        </div>

        {/* HEADING */}
        <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-100 max-w-4xl transition-colors duration-200">
          Assam&apos;s Unified Academic &amp; Recruitment Notice Platform
        </h1>

        {/* SUBTITLE */}
        <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 transition-colors duration-200">
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

        {/* QUICK LINKS */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mr-1.5">
            Browse By:
          </span>
          {quickLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-full border border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/30 px-3.5 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-300"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* LIVE PLATFORM STATS */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="animate-fade-in relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 dark:border-zinc-900 dark:bg-zinc-950/40 p-4 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-800/80 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 shadow-sm"
                style={{
                  animationDelay: item.delay,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors duration-200">
                      {item.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-2 border shrink-0 ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

