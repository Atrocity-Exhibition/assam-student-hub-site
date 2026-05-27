import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/home/footer";
import { getSavedNotices } from "@/services/saved-notices";
import { createClient } from "@/lib/supabase/server";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";
import { getRelativeTime } from "@/lib/utils";



export default async function SavedNoticesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const notices = await getSavedNotices();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-border bg-card/50 px-4 py-2 text-sm text-muted font-semibold uppercase tracking-wider">
              Personal Dashboard
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Saved Updates
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted">
              Manage your bookmarked opportunities, exam schedules, results, and notifications.
            </p>
          </div>

          {/* EMPTY STATE */}
          {notices.length === 0 && (
            <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-border bg-card/30 backdrop-blur-sm p-12 text-center shadow-xl max-w-xl mx-auto">
              <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 mb-6">
                <Bookmark className="h-8 w-8 animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground">
                No saved updates yet
              </h2>

              <p className="mt-3 text-muted text-sm max-w-sm">
                Start bookmarking opportunities to keep track of deadlines, exam schedules, and results here.
              </p>

              <Link
                href="/jobs"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                Browse Updates
              </Link>
            </div>
          )}

          {/* GRID */}
          {notices.length > 0 && (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {notices.map((notice) => {
                const hoverClasses = getCategoryHoverClasses(notice.category);
                
                return (
                  <Link
                    key={notice.id}
                    href={`/jobs/${notice.slug}`}
                    className="block"
                  >
                    <article className={`group h-full flex flex-col justify-between rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/5 shadow-sm ${hoverClasses.border}`}>
                      <div className="flex gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="mb-3.5 flex items-center justify-between gap-4">
                            <div className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                              {notice.category || "Notice"}
                            </div>
                            
                            {notice.institutions?.name && (
                              <span className="text-xs text-muted font-bold uppercase tracking-wider truncate max-w-[200px]">
                                {notice.institutions.name}
                              </span>
                            )}
                          </div>

                          <h2 className={`text-base sm:text-lg font-extrabold leading-snug text-foreground transition-colors duration-300 line-clamp-2 ${hoverClasses.text}`}>
                            {notice.title}
                          </h2>

                          <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-muted transition-colors duration-200">
                            {notice.description || "No description provided. Click to view the full announcement details and official attachments."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3.5 text-xs text-muted font-semibold uppercase tracking-wider">
                        <span>{notice.source}</span>
                        <span>{getRelativeTime(notice.posted_at || notice.created_at)}</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>

        <Footer />
      </main>
    </>
  );
}
