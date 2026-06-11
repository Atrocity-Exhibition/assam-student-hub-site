import Link from "next/link";
import { getInstitutions } from "@/services/institutions";
import { getAcademicNotices } from "@/services/notices";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";
import { getRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InstitutionLogo } from "@/components/shared/institution-logo";

export async function UniversitiesSection() {
  const [allInstitutions, academicNotices] = await Promise.all([
    getInstitutions(),
    getAcademicNotices(7),
  ]);

  const NON_ACADEMIC_SLUGS = [
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

  // Filter out non-academic entities (agencies, aggregators, PSUs, etc.)
  const institutions = allInstitutions.filter(
    (inst) => !NON_ACADEMIC_SLUGS.includes(inst.slug)
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
    <section className="border-t border-border py-6 md:py-10 transition-colors duration-200">
      {/* SECTION HEADER */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
          Browse Institutions
        </h2>
        <p className="mt-1 text-muted text-sm transition-colors duration-200">
          Explore colleges and universities to find their latest official updates.
        </p>
      </div>

      {/* INSTITUTIONS CAROUSEL/GRID */}
      <div className="mt-6 md:mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-hide w-full max-w-full">
        {institutions.map((uni) => (
          <Link
            key={uni.slug}
            href={`/institutions/${uni.slug}`}
            className="group min-w-[320px] rounded-2xl border border-border bg-card/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-border hover:bg-brand-bg/30 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background flex gap-4 items-start"
          >
            <InstitutionLogo logoUrl={uni.logo_url} name={uni.name} className="h-10 w-10 text-sm" />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 transition group-hover:text-brand-text truncate">
                {uni.name}
              </h3>
              <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                Official updates, announcements, schedules, results, and student services.
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 md:mt-8 flex justify-center">
        <Link href="/institutions">
          <Button
            variant="secondary"
            className="rounded-full text-xs sm:text-sm hover:text-brand-text hover:border-brand-border hover:bg-brand-bg/30"
          >
            Browse All Institutions
          </Button>
        </Link>
      </div>

      {/* ACADEMIC UPDATES FEED */}
      <div className="mt-12 md:mt-16 border-t border-border pt-8 md:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
              Latest Academic Updates
            </h2>
            <p className="mt-1 text-muted text-sm transition-colors duration-200">
              Exam routines, results, admissions, and scholarship details from verified colleges and universities.
            </p>
          </div>
          <Link
            href="/jobs"
            className="mt-3 sm:mt-0 text-xs sm:text-sm font-bold text-brand-text hover:opacity-85 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-lg px-2 py-1"
          >
            View all academic updates &rarr;
          </Link>
        </div>

        {/* IMPORTANT ACADEMIC NOTICE HIGHLIGHT */}
        {importantAcademicNotice && (
          <Link
            href={`/jobs/${importantAcademicNotice.slug}`}
            className="block mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:focus-visible:ring-brand/50 rounded-2xl"
          >
            <div className="relative group overflow-hidden rounded-2xl border border-brand-border bg-brand-bg p-4 sm:p-5 shadow-sm shadow-brand/5 transition-all duration-300 hover:border-brand/30 hover:bg-brand-bg/85">
              {/* Ambient subtle glow background */}
              <div className="absolute -inset-y-12 -left-12 w-64 bg-brand/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex items-center justify-center">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                    </span>
                  </span>
                  
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-brand-bg border border-brand-border px-2.5 py-0.5 text-[9px] font-bold text-brand-text uppercase tracking-wider">
                        Featured Academic Update
                      </span>
                      {importantAcademicNotice.institutions?.name && (
                        <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                          {importantAcademicNotice.institutions.name}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-1.5 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-text transition-colors duration-200">
                      {importantAcademicNotice.title}
                    </h4>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-brand-text">
                  <span>View Details</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ACADEMIC NOTICES GRID */}
        {gridAcademicNotices.length === 0 ? (
          <div className="mt-6 md:mt-8 w-full rounded-2xl sm:rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-6 sm:p-10 text-center">
            <p className="text-muted text-sm">No academic announcements indexed yet.</p>
          </div>
        ) : (
          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {gridAcademicNotices.map((notice) => {
              const hoverClasses = getCategoryHoverClasses(notice.category);
              const dateStr = getRelativeTime(notice.posted_at || notice.created_at);

              return (
                <Link
                  key={notice.id}
                  href={`/jobs/${notice.slug}`}
                  className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <article className={`group h-full flex flex-col justify-between rounded-2xl border border-border bg-card/50 p-5 hover:bg-card/75 hover:-translate-y-0.5 transition-all duration-300 shadow-sm ${hoverClasses.border} min-h-fit sm:min-h-[180px]`}>
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                          {notice.category}
                        </span>
                        {notice.institutions?.name && (
                          <span className="text-[10px] text-muted font-semibold uppercase tracking-wider truncate max-w-[150px]">
                            {notice.institutions.name}
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`text-sm sm:text-base font-bold leading-snug text-zinc-900 dark:text-zinc-100 transition duration-300 line-clamp-2 ${hoverClasses.text}`}>
                        {notice.title}
                      </h3>
                      
                      <p className="mt-2 text-xs text-muted line-clamp-2">
                        {notice.description || "Click to view full details and official document."}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-semibold text-muted">
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
