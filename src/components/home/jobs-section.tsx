import Link from "next/link";
import { getNotices } from "@/services/notices";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";
import { getRelativeTime, extractSalary } from "@/lib/utils";
import { Banknote, Users, Calendar, GraduationCap, FileText } from "lucide-react";
import { InstitutionLogo } from "@/components/shared/institution-logo";



export async function JobsSection() {
  const { notices } = await getNotices({ page: 1, sort: "latest", category: "recruitment" });
  // Limit to first 6 notices for homepage high density feed
  const latestNotices = notices.slice(0, 6);

  // Check for any important notice in the retrieved list
  const importantNotice = latestNotices.find((n) => n.tags?.includes("important"));
  
  // Filter out the highlighted important notice from the general grid to prevent duplication
  const gridNotices = importantNotice
    ? latestNotices.filter((n) => n.id !== importantNotice.id)
    : latestNotices;

  const featuredNotice = gridNotices[0];
  const compactNotices = gridNotices.slice(1, 5); // Keep up to 4 in stack

  return (
    <section className="py-6 md:py-10 transition-colors duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
            Latest Jobs &amp; Recruitments
          </h2>
          <p className="mt-1 text-muted text-sm transition-colors duration-200">
            Verified job vacancies, official recruitment notifications, and career announcements.
          </p>
        </div>
        <Link
          href="/jobs?category=recruitment"
          className="mt-3 sm:mt-0 text-xs sm:text-sm font-bold text-brand-text hover:opacity-85 transition-all duration-200"
        >
          View all jobs &rarr;
        </Link>
      </div>

      {/* IMPORTANT NOTICE BANNER */}
      {importantNotice && (
        <Link href={`/jobs/${importantNotice.slug}`} className="block mt-6">
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
                      Featured Job Update
                    </span>
                    {importantNotice.institutions?.name && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-muted font-semibold uppercase tracking-wider font-sans">
                        <InstitutionLogo
                          logoUrl={importantNotice.institutions.logo_url}
                          name={importantNotice.institutions.name}
                          className="h-4.5 w-4.5"
                        />
                        {importantNotice.institutions.name}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1.5 text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand transition-colors duration-200">
                    {importantNotice.title}
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

      {/* NOTICES GRID */}
      {gridNotices.length === 0 ? (
        <div className="mt-6 md:mt-8 w-full rounded-2xl sm:rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-6 sm:p-10 text-center">
          <p className="text-muted text-sm">No job recruitments indexed yet.</p>
        </div>
      ) : (
        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* FEATURED NOTICE CARD (Col span 2) */}
          <div className="lg:col-span-2">
            {featuredNotice && (() => {
              const hoverClasses = getCategoryHoverClasses(featuredNotice.category);
              const formattedDate = getRelativeTime(featuredNotice.posted_at || featuredNotice.created_at);

              return (
                <Link href={`/jobs/${featuredNotice.slug}`} className="block h-full">
                  <article className={`group h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border bg-card/70 p-4 sm:p-6 lg:p-8 overflow-hidden transition-all duration-300 dark:hover:bg-zinc-900/10 hover:bg-zinc-50/50 shadow-sm ${hoverClasses.border} min-h-fit sm:min-h-[340px]`}>
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className={`inline-flex rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${getCategoryStyles(featuredNotice.category)}`}>
                            {featuredNotice.category || "Job"}
                          </span>
                          {featuredNotice.institutions?.name && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted font-semibold uppercase tracking-wider truncate max-w-[200px] sm:max-w-[300px]">
                              <InstitutionLogo
                                logoUrl={featuredNotice.institutions.logo_url}
                                name={featuredNotice.institutions.name}
                                className="h-5 w-5"
                              />
                              {featuredNotice.institutions.name}
                            </span>
                          )}
                        </div>

                        <h3 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight text-zinc-900 dark:text-zinc-100 transition-colors duration-300 ${hoverClasses.text}`}>
                          {featuredNotice.title}
                        </h3>

                        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3 transition-colors duration-200">
                          {featuredNotice.description || "No description available. Click to view the official recruitment details."}
                        </p>

                        {/* Rich Badges Grid */}
                        {(() => {
                          const md = (featuredNotice.metadata || {}) as Record<string, string | number | null>;
                          const badges: Array<{ icon: React.ReactNode; text: React.ReactNode; color: string }> = [];

                          const salary = extractSalary(featuredNotice.title, featuredNotice.description, featuredNotice.metadata);
                          if (salary) {
                            badges.push({
                              icon: <Banknote className="h-3.5 w-3.5 shrink-0" />,
                              text: `Salary: ${salary}`,
                              color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400"
                            });
                          }

                          if (md.vacancies) {
                            badges.push({
                              icon: <Users className="h-3.5 w-3.5 shrink-0" />,
                              text: `${md.vacancies} Vacancies`,
                              color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-400"
                            });
                          }

                          if (md.last_date) {
                            badges.push({
                              icon: <Calendar className="h-3.5 w-3.5 shrink-0" />,
                              text: `Apply By: ${md.last_date}`,
                              color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400"
                            });
                          }

                          if (md.qualification) {
                            badges.push({
                              icon: <GraduationCap className="h-3.5 w-3.5 shrink-0" />,
                              text: md.qualification,
                              color: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/5 dark:text-purple-400"
                            });
                          }

                          if (featuredNotice.attachment_url) {
                            badges.push({
                              icon: <FileText className="h-3.5 w-3.5 shrink-0" />,
                              text: "PDF Attachment",
                              color: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:bg-zinc-500/5 dark:text-zinc-400"
                            });
                          }

                          if (badges.length === 0) return null;

                          return (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {badges.map((b, i) => (
                                <div key={i} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${b.color}`}>
                                  {b.icon}
                                  <span>{b.text}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between flex-wrap gap-3">
                      <span className="text-xs font-semibold text-muted uppercase tracking-wider transition-colors duration-200">
                        Source: {featuredNotice.source}
                      </span>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted font-semibold tracking-wide transition-colors duration-200">
                          {formattedDate}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-black ${hoverClasses.text} transition-all duration-300`}>
                          View Notice
                          <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out font-normal">&rarr;</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })()}
          </div>

          {/* COMPACT STACK FEED (Col span 1) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted transition-colors duration-200">
                Recent Jobs
              </h3>
            </div>
            
            {compactNotices.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card/40 p-6 text-center">
                <p className="text-xs text-muted">No additional job updates.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {compactNotices.map((notice) => {
                  const hoverClasses = getCategoryHoverClasses(notice.category);
                  const dateStr = getRelativeTime(notice.posted_at || notice.created_at);

                  return (
                    <Link key={notice.id} href={`/jobs/${notice.slug}`} className="block">
                      <div className={`group flex flex-col justify-between p-4 rounded-2xl border border-border bg-card/50 hover:bg-card/75 transition-all duration-300 shadow-sm ${hoverClasses.border}`}>
                        <div className="flex gap-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${getCategoryStyles(notice.category)}`}>
                                {notice.category || "Job"}
                              </span>
                              <span className="text-[10px] font-semibold text-muted shrink-0">{dateStr}</span>
                            </div>
                            
                            <h4 className={`text-xs sm:text-sm font-bold leading-snug text-zinc-800 dark:text-zinc-300 line-clamp-2 transition-colors duration-300 ${hoverClasses.text}`}>
                              {notice.title}
                            </h4>
                            
                            {(() => {
                              const salary = extractSalary(notice.title, notice.description, notice.metadata);
                              return salary ? (
                                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  <Banknote className="h-3.5 w-3.5 shrink-0" />
                                  <span>{salary}</span>
                                </div>
                              ) : null;
                            })()}

                            <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-muted truncate max-w-[160px]">
                                {notice.institutions?.name ? (
                                  <>
                                    <InstitutionLogo
                                      logoUrl={notice.institutions.logo_url}
                                      name={notice.institutions.name}
                                      className="h-4.5 w-4.5"
                                    />
                                    {notice.institutions.name}
                                  </>
                                ) : (
                                  notice.source
                                )}
                              </span>
                              <span className={`inline-flex items-center gap-0.5 text-[10px] font-black ${hoverClasses.text} transition-all duration-300`}>
                                View Notice
                                <span className="group-hover:translate-x-1 transition-transform duration-300 ease-out font-normal">&rarr;</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER BUTTON */}
      <div className="mt-6 md:mt-8 flex justify-center">
        <Link
          href="/jobs?category=recruitment"
          className="rounded-full border border-border bg-card/45 px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-card hover:text-brand-text shadow-sm hover:shadow"
        >
          Browse All Job Opportunities
        </Link>
      </div>
    </section>
  );
}
