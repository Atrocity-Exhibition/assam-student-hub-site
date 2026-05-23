import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, Trash2, History, Star } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { getSavedSearches } from "@/services/saved-searches";
import { createClient } from "@/lib/supabase/server";
import { deleteSearchAction } from "./actions";
import { getRelativeTime } from "@/lib/utils";

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

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              Personalized
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Saved Searches
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted">
              Quickly re-run your saved search queries. Notifications will be available in a future update.
            </p>
          </div>

          {/* SAVED SEARCHES LIST */}
          <section className="mt-14">
            {savedSearches.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card/30 backdrop-blur-sm p-12 text-center shadow-xl max-w-xl mx-auto">
                <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 mb-6">
                  <Search className="h-8 w-8 animate-pulse" />
                </div>
                
                <h2 className="text-2xl font-bold text-foreground">No saved searches yet</h2>
                
                <p className="mt-3 text-muted text-sm max-w-sm">
                  Search for updates on the{" "}
                  <Link href="/jobs" className="text-emerald-600 hover:underline dark:text-emerald-400 font-semibold">
                    jobs page
                  </Link>{" "}
                  and click{" "}
                  <strong className="text-foreground inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-500 shrink-0" />
                    Save this search
                  </strong>{" "}
                  to store your favorite queries here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedSearches.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-border-foreground/30 hover:bg-card/70 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        {item.category ? (
                          <span className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-semibold text-muted capitalize">
                            {item.category}
                          </span>
                        ) : (
                          <span className="rounded-full border border-border bg-card/85 px-3 py-1 text-xs font-semibold text-muted">
                            All Categories
                          </span>
                        )}
                        <History className="h-4 w-4 text-muted/60" />
                      </div>
                      
                      <h2 className="text-lg font-bold text-foreground capitalize line-clamp-1">
                        {item.label || item.query}
                      </h2>
                      
                      {item.label && (
                        <p className="mt-1 text-xs text-muted font-mono truncate">
                          &quot;{item.query}&quot;
                        </p>
                      )}
                      
                      <p className="mt-2 text-xs text-muted/80">
                        Saved {getRelativeTime(item.created_at)}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <Link
                        href={`/jobs?search=${encodeURIComponent(item.query)}${item.category ? `&category=${encodeURIComponent(item.category)}` : ""}`}
                        className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-500/10"
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
                          className="rounded-2xl border border-border p-2.5 text-muted transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400"
                          title="Delete saved search"
                        >
                          <Trash2 className="h-4 w-4" />
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
