import Link from "next/link";
import { getNotices } from "@/services/notices";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";

export async function NoticesSection() {
  const { notices } = await getNotices({ page: 1, sort: "latest" });
  // Limit to first 5 notices for homepage high density feed
  const latestNotices = notices.slice(0, 5);

  const featuredNotice = latestNotices[0];
  const compactNotices = latestNotices.slice(1);

  return (
    <section className="py-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-zinc-900 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-100">
            Latest Announcements
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Recently aggregated exams, recruitment details, results, and admission schedules.
          </p>
        </div>
        <Link
          href="/notices"
          className="mt-4 md:mt-0 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
        >
          View all notices &rarr;
        </Link>
      </div>

      {/* NOTICES GRID */}
      {latestNotices.length === 0 ? (
        <div className="mt-10 w-full rounded-3xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-sm p-10 text-center">
          <p className="text-zinc-500 text-sm">No announcements indexed yet.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FEATURED NOTICE CARD (Col span 2) */}
          <div className="lg:col-span-2">
            {featuredNotice && (() => {
              const hoverClasses = getCategoryHoverClasses(featuredNotice.category);
              const formattedDate = featuredNotice.posted_at
                ? new Date(featuredNotice.posted_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : new Date(featuredNotice.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

              return (
                <Link href={`/notices/${featuredNotice.slug}`} className="block h-full">
                  <article className={`group h-full flex flex-col justify-between rounded-3xl border border-zinc-900 bg-zinc-950/40 p-8 transition-all duration-300 ${hoverClasses.border} hover:bg-zinc-900/10`}>
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <span className={`inline-flex rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${getCategoryStyles(featuredNotice.category)}`}>
                          {featuredNotice.category || "Notice"}
                        </span>
                        {featuredNotice.institutions?.name && (
                          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider truncate max-w-[250px]">
                            {featuredNotice.institutions.name}
                          </span>
                        )}
                      </div>

                      <h3 className={`text-2xl font-bold leading-tight text-zinc-100 transition-colors duration-300 ${hoverClasses.text}`}>
                        {featuredNotice.title}
                      </h3>

                      <p className="mt-4 text-sm leading-relaxed text-zinc-400 line-clamp-4">
                        {featuredNotice.description || "No description available. Click to view the official attachment and source website details."}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-900/80 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Source: {featuredNotice.source}
                      </span>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-500 font-medium">
                          {formattedDate}
                        </span>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${hoverClasses.text} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0`}>
                          Read More &rarr;
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })()}
          </div>

          {/* COMPACT STACK FEED (Col span 1) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900/80">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Latest Updates
              </h3>
            </div>
            
            {compactNotices.length === 0 ? (
              <div className="rounded-2xl border border-zinc-900/80 bg-zinc-950/20 p-6 text-center">
                <p className="text-xs text-zinc-650">No additional updates.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {compactNotices.map((notice) => {
                  const hoverClasses = getCategoryHoverClasses(notice.category);
                  const dateStr = notice.posted_at
                    ? new Date(notice.posted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : new Date(notice.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                  return (
                    <Link key={notice.id} href={`/notices/${notice.slug}`} className="block">
                      <div className={`group flex flex-col justify-between p-4.5 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:bg-zinc-900/10 transition-all duration-300 ${hoverClasses.border}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                            {notice.category || "Notice"}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-500 shrink-0">{dateStr}</span>
                        </div>
                        <h4 className={`text-sm font-semibold leading-snug text-zinc-200 line-clamp-2 transition-colors duration-300 ${hoverClasses.text}`}>
                          {notice.title}
                        </h4>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 truncate">
                          {notice.institutions?.name || notice.source}
                        </p>
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
      <div className="mt-12 flex justify-center">
        <Link
          href="/notices"
          className="rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-400 shadow-md shadow-black/10"
        >
          Browse All Notices &amp; Updates
        </Link>
      </div>
    </section>
  );
}
