import Link from "next/link";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/home/footer";
import { getSavedNotices } from "@/services/saved-notices";
import { createClient } from "@/lib/supabase/server";

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

      <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 selection:text-red-400">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 font-semibold uppercase tracking-wider">
              Personal Dashboard
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-zinc-100">
              Saved Notices
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Manage your bookmarked notices, exam schedules, results, and opportunities.
            </p>
          </div>

          {/* EMPTY STATE */}
          {notices.length === 0 && (
            <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-10 text-center shadow-xl">
              <h2 className="text-2xl font-bold text-zinc-200">
                No saved notices yet
              </h2>

              <p className="mt-4 text-zinc-400 text-sm">
                Start bookmarking notices and opportunities to see them here.
              </p>

              <Link
                href="/notices"
                className="mt-6 inline-flex rounded-2xl bg-red-500 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/10"
              >
                Browse Notices
              </Link>
            </div>
          )}

          {/* GRID */}
          {notices.length > 0 && (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.slug}`}
                  className="block"
                >
                  <article className="group h-full flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/30 shadow-md hover:shadow-lg">
                    <div>
                      <div className="mb-4 inline-flex rounded-full border border-zinc-800 bg-zinc-900/50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        {notice.category || "Notice"}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold leading-tight text-zinc-200 transition group-hover:text-red-400">
                        {notice.title}
                      </h2>

                      <p className="mt-4 line-clamp-3 leading-7 text-zinc-400 text-sm">
                        {notice.description || "No description available."}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      <span>{notice.source}</span>

                      <span>
                        {new Date(notice.posted_at || notice.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </Container>

        <Footer />
      </main>
    </>
  );
}
