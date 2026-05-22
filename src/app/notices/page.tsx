import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { NoticesList } from "@/components/notices/notices-list";
import { TrendingSearches } from "@/components/shared/trending-searches";
import { SaveSearchButton } from "@/components/notices/save-search-button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Official Notices & Updates | AssamStudentHub",
  description:
    "Browse the latest exam routines, admissions, results, recruitment notifications, and scholarships from universities and government boards in Assam.",
};

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function NoticesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const category = params.category || "All";
  const page = Number(params.page || "1");
  const sort = params.sort || "newest";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-border bg-card/40 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              Assam Announcements Aggregator
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Official Notices & Updates
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted max-w-2xl">
              Stay updated with real-time, verified notifications, exam schedules, academic admissions, recruitment advertisements, and scholarships sourced directly from university boards and government portals across Assam.
            </p>
          </div>

          {/* Trending searches shown only when user isn't actively searching */}
          {!search && <TrendingSearches />}

          {/* Save search button shown when an active search is running */}
          {search && (
            <div className="mt-6">
              <SaveSearchButton
                query={search}
                category={category !== "All" ? category : null}
                isAuthenticated={!!user}
              />
            </div>
          )}

          <NoticesList
            search={search}
            category={category}
            page={page}
            sort={sort}
          />
        </Container>

        <Footer />
      </main>
    </>
  );
}
