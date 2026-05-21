import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { getSavedSearches } from "@/services/saved-searches";
import { createClient } from "@/lib/supabase/server";
import { deleteSearchAction } from "./actions";

export const metadata: Metadata = {
  title: "Saved Searches | AssamStudentHub",
  description: "Manage your saved search queries and find exactly what you're looking for.",
};

export default async function SavedSearchesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const savedSearches = await getSavedSearches();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 selection:text-red-400">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Personalized
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Saved Searches
            </h1>
            <p className="mt-6 text-base leading-relaxed text-zinc-400">
              Quickly re-run your saved search queries. Notifications will be available in a future update.
            </p>
          </div>

          {/* SAVED SEARCHES LIST */}
          <section className="mt-14">
            {savedSearches.length === 0 ? (
              <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-sm p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-zinc-300">No saved searches yet</h2>
                <p className="mt-3 text-zinc-500 text-sm max-w-md mx-auto">
                  Search for notices on the{" "}
                  <Link href="/notices" className="text-red-400 hover:underline">
                    notices page
                  </Link>{" "}
                  and click <strong className="text-zinc-300">☆ Save this search</strong> to store a query here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedSearches.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between rounded-3xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm p-6 transition-all duration-300 hover:border-zinc-700/80"
                  >
                    <div>
                      {item.category && (
                        <span className="inline-block mb-3 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs font-semibold text-zinc-400 capitalize">
                          {item.category}
                        </span>
                      )}
                      <h2 className="text-lg font-bold text-zinc-200 capitalize">
                        {item.label || item.query}
                      </h2>
                      {item.label && (
                        <p className="mt-1 text-xs text-zinc-500 font-mono">
                          &quot;{item.query}&quot;
                        </p>
                      )}
                      <p className="mt-2 text-xs text-zinc-600">
                        Saved{" "}
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <Link
                        href={`/notices?search=${encodeURIComponent(item.query)}${item.category ? `&category=${encodeURIComponent(item.category)}` : ""}`}
                        className="flex-1 rounded-2xl bg-red-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-red-400"
                      >
                        Search Now
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await deleteSearchAction(item.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-2xl border border-zinc-800 p-2.5 text-zinc-500 transition-all duration-200 hover:border-red-900/60 hover:bg-red-900/10 hover:text-red-400"
                          title="Delete saved search"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </Container>

        <Footer />
      </main>
    </>
  );
}
