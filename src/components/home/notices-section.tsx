import Link from "next/link";
import { getNotices } from "@/services/notices";
import { getCategoryStyles } from "@/components/notices/notices-list";

export async function NoticesSection() {
  const { notices } = await getNotices({ page: 1, sort: "newest" });
  // Limit to first 6 notices for homepage display
  const latestNotices = notices.slice(0, 6);

  return (
    <section className="py-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-100">
            Latest Announcements
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Recently aggregated exams, recruitment details, results, and admission schedules.
          </p>
        </div>
        <Link
          href="/notices"
          className="mt-4 md:mt-0 text-sm font-semibold text-red-500 hover:text-red-400 transition"
        >
          View all notices →
        </Link>
      </div>

      {/* NOTICES LIST */}
      <div className="mt-10 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {latestNotices.length === 0 ? (
          <div className="w-full rounded-3xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-sm p-10 text-center">
            <p className="text-zinc-500 text-sm">No announcements indexed yet.</p>
          </div>
        ) : (
          latestNotices.map((notice) => (
            <Link key={notice.id} href={`/notices/${notice.slug}`} className="shrink-0">
              <article className="group w-[320px] sm:w-[350px] h-[320px] flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm p-7 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/45 hover:shadow-xl hover:shadow-black/25">
                <div>
                  {/* CATEGORY */}
                  <div className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                    {notice.category || "Notice"}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-bold leading-snug text-zinc-100 transition line-clamp-3 group-hover:text-red-400">
                    {notice.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-3 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                    {notice.description || "No description available. Click to view the official attachment and source website details."}
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-6 flex items-center justify-between text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                  <span>{notice.source}</span>
                  <span>
                    {notice.posted_at
                      ? new Date(notice.posted_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : new Date(notice.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                  </span>
                </div>
              </article>
            </Link>
          ))
        )}
      </div>

      {/* BUTTON */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/notices"
          className="rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-white shadow-md shadow-black/10"
        >
          Browse All Notices & Updates
        </Link>
      </div>
    </section>
  );
}
