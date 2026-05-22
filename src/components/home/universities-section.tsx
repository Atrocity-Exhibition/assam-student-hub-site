import Link from "next/link";
import { getInstitutions } from "@/services/institutions";
import { getAcademicNotices } from "@/services/notices";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";
import { getRelativeTime } from "@/lib/utils";

const categoryAccentColors: Record<string, string> = {
  recruitment: "bg-emerald-500",
  result: "bg-blue-500",
  exam: "bg-amber-500",
  admission: "bg-purple-500",
  scholarship: "bg-pink-500",
  notice: "bg-zinc-500",
};

const categoryAlertStyles: Record<string, { border: string; bg: string; text: string; dot: string; pulse: string; badge: string; glow: string }> = {
  recruitment: {
    border: "border-emerald-500/20 hover:border-emerald-500/30",
    bg: "bg-emerald-500/5 hover:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
    dot: "bg-emerald-500",
    pulse: "bg-emerald-400",
    badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    glow: "bg-emerald-500/5",
  },
  result: {
    border: "border-blue-500/20 hover:border-blue-500/30",
    bg: "bg-blue-500/5 hover:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300",
    dot: "bg-blue-500",
    pulse: "bg-blue-400",
    badge: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    glow: "bg-blue-500/5",
  },
  exam: {
    border: "border-amber-500/20 hover:border-amber-500/30",
    bg: "bg-amber-500/5 hover:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300",
    dot: "bg-amber-500",
    pulse: "bg-amber-400",
    badge: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    glow: "bg-amber-500/5",
  },
  admission: {
    border: "border-purple-500/20 hover:border-purple-500/30",
    bg: "bg-purple-500/5 hover:bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300",
    dot: "bg-purple-500",
    pulse: "bg-purple-400",
    badge: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
    glow: "bg-purple-500/5",
  },
  scholarship: {
    border: "border-pink-500/20 hover:border-pink-500/30",
    bg: "bg-pink-500/5 hover:bg-pink-500/10",
    text: "text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300",
    dot: "bg-pink-500",
    pulse: "bg-pink-400",
    badge: "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400",
    glow: "bg-pink-500/5",
  },
  notice: {
    border: "border-zinc-500/20 hover:border-zinc-500/30",
    bg: "bg-zinc-500/5 hover:bg-zinc-500/10",
    text: "text-zinc-650 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-205",
    dot: "bg-zinc-500",
    pulse: "bg-zinc-400",
    badge: "bg-zinc-500/10 border-zinc-500/20 text-zinc-500 dark:text-zinc-400",
    glow: "bg-zinc-500/5",
  },
};

const getAlertStyle = (category: string | null) => {
  const cat = (category || "").toLowerCase();
  return categoryAlertStyles[cat] || categoryAlertStyles.notice;
};

export async function UniversitiesSection() {
  const [allInstitutions, academicNotices] = await Promise.all([
    getInstitutions(),
    getAcademicNotices(7),
  ]);

  // Filter out APSC and SLPRB (agencies, not college/universities)
  const institutions = allInstitutions.filter(
    (inst) =>
      inst.slug !== "assam-public-service-commission" &&
      inst.slug !== "state-level-police-recruitment-board"
  );

  // Check for any important notice in the academic list
  const importantAcademicNotice = academicNotices.find((n) => n.tags?.includes("important"));
  
  // Filter out the highlighted important academic notice from the list to prevent duplication
  const filteredAcademicNotices = importantAcademicNotice
    ? academicNotices.filter((n) => n.id !== importantAcademicNotice.id)
    : academicNotices;

  // Limit to first 6 notices for grid layout
  const gridAcademicNotices = filteredAcademicNotices.slice(0, 6);

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-900 py-10 transition-colors duration-200">
      {/* SECTION HEADER */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
          Browse Institutions
        </h2>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400 text-sm transition-colors duration-200">
          Explore colleges and universities to find their latest official updates.
        </p>
      </div>

      {/* INSTITUTIONS CAROUSEL/GRID */}
      <div className="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {institutions.map((uni) => (
          <Link
            key={uni.slug}
            href={`/institutions/${uni.slug}`}
            className="group min-w-[280px] rounded-2xl border border-border bg-card/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 shadow-sm"
          >
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {uni.name}
            </h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Official updates, announcements, schedules, results, and student services.
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/institutions"
          className="rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 px-6 py-2.5 text-xs sm:text-sm font-semibold text-zinc-650 dark:text-zinc-300 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm"
        >
          Browse All Institutions
        </Link>
      </div>

      {/* ACADEMIC UPDATES FEED */}
      <div className="mt-16 border-t border-zinc-200 dark:border-zinc-900 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-zinc-200 dark:border-zinc-900 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
              Latest Academic Updates
            </h2>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400 text-sm transition-colors duration-200">
              Exam routines, results, admissions, and scholarship details from verified colleges and universities.
            </p>
          </div>
          <Link
            href="/notices"
            className="mt-3 sm:mt-0 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200"
          >
            View all academic updates &rarr;
          </Link>
        </div>

        {/* IMPORTANT ACADEMIC NOTICE HIGHLIGHT */}
        {importantAcademicNotice && (() => {
          const alertStyle = getAlertStyle(importantAcademicNotice.category);
          return (
            <Link href={`/notices/${importantAcademicNotice.slug}`} className="block mt-6">
              <div className={`relative group overflow-hidden rounded-2xl border ${alertStyle.border} ${alertStyle.bg} p-4 sm:p-5 shadow-sm transition-all duration-300`}>
                {/* Ambient subtle glow background */}
                <div className={`absolute -inset-y-12 -left-12 w-64 ${alertStyle.glow} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex items-center justify-center">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${alertStyle.pulse} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${alertStyle.dot}`}></span>
                      </span>
                    </span>
                    
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(importantAcademicNotice.category)}`}>
                          Featured {importantAcademicNotice.category} Notice
                        </span>
                        {importantAcademicNotice.institutions?.name && (
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                            {importantAcademicNotice.institutions.name}
                          </span>
                        )}
                      </div>
                      <h4 className={`mt-1.5 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 ${alertStyle.text} transition-colors duration-200`}>
                        {importantAcademicNotice.title}
                      </h4>
                    </div>
                  </div>
                  
                  <div className={`shrink-0 flex items-center gap-2 text-xs font-bold ${alertStyle.text}`}>
                    <span>View Details</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* ACADEMIC NOTICES GRID */}
        {gridAcademicNotices.length === 0 ? (
          <div className="mt-8 w-full rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-10 text-center">
            <p className="text-muted text-sm">No academic announcements indexed yet.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridAcademicNotices.map((notice) => {
              const hoverClasses = getCategoryHoverClasses(notice.category);
              const dateStr = getRelativeTime(notice.posted_at || notice.created_at);
              const accentColor = categoryAccentColors[(notice.category || "").toLowerCase()] || "bg-zinc-500";

              return (
                <Link key={notice.id} href={`/notices/${notice.slug}`} className="block">
                  <article className={`group h-full flex flex-col justify-between rounded-2xl border border-border bg-card/50 p-5 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-all duration-300 shadow-sm ${hoverClasses.border} min-h-[180px]`}>
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                          {notice.category}
                        </span>
                        {notice.institutions?.name && (
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider truncate max-w-[150px]">
                            {notice.institutions.name}
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`text-sm sm:text-base font-bold leading-snug text-zinc-900 dark:text-zinc-100 transition duration-300 line-clamp-2 ${hoverClasses.text}`}>
                        {notice.title}
                      </h3>
                      
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {notice.description || "Click to view full details and official document."}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-900/80 flex items-center justify-between text-[11px] font-semibold text-zinc-550 dark:text-zinc-400">
                      <span>Source: {notice.source}</span>
                      <span>{dateStr}</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
