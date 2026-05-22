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
    <section className="border-b border-zinc-900/60 pb-16 pt-20">
      <div className="max-w-5xl w-full">
        {/* TAG */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-xs font-semibold text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Assam jobs, scholarships & student updates
        </div>

        {/* HEADING */}
        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl text-zinc-100 max-w-4xl">
          Assam&apos;s Unified Academic &amp; Recruitment Notice Platform
        </h1>

        {/* SUBTITLE */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-400">
          Search official Assam government jobs, university notices, scholarships,
          admissions, exam updates, and student opportunities in one place.
        </p>

        {/* SEARCH */}
        <div className="mt-10 max-w-3xl">
          <HeroSearch />
        </div>

        {/* TRENDING / FALLBACK SEARCHES */}
        <div className="max-w-3xl">
          <TrendingSearches />
        </div>

        {/* QUICK LINKS */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mr-1">
            Browse By:
          </span>
          {quickLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-full border border-zinc-800 bg-zinc-900/30 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-300"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* LIVE PLATFORM STATS */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="animate-fade-in relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 transition-all duration-300 hover:border-zinc-800/80 hover:bg-zinc-900/10"
                style={{
                  animationDelay: item.delay,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider truncate">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
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

