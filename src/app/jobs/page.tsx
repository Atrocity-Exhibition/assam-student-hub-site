import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone, ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { NoticesList } from "@/components/notices/notices-list";
import { TrendingSearches } from "@/components/shared/trending-searches";
import { SaveSearchButton } from "@/components/notices/save-search-button";
import { createClient } from "@/lib/supabase/server";
import { getImportantNotice } from "@/services/notices";
import { getRelativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Official Assam Government Jobs & Recruitments | AssamStudentHub",
  description:
    "Browse the latest exam results, interview lists, skill tests, and job recruitment notifications from APSC, SLPRB, and other government boards in Assam.",
  alternates: {
    canonical: "https://www.assamstudenthub.xyz/jobs",
  },
};

type PageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const page = Number(params.page || "1");
  const sort = params.sort || "newest";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch featured important recruitment notice
  const importantNotice = await getImportantNotice("job");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-border bg-card/40 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              Recruitments & Board updates
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Official Assam Government Jobs
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted max-w-2xl">
              Stay updated with real-time, verified recruitment advertisements, application deadlines, list of candidates, and results sourced directly from APSC, SLPRB, and other state departments.
            </p>
          </div>

          {/* Trending searches shown only when user isn't actively searching */}
          {!search && <TrendingSearches />}

          {/* Save search button shown when an active search is running */}
          {search && (
            <div className="mt-6">
              <SaveSearchButton
                query={search}
                category="recruitment"
                isAuthenticated={!!user}
              />
            </div>
          )}

          {/* IMPORTANT NOTICE BANNER */}
          {!search && page === 1 && importantNotice && (
            <Link href={`/jobs/${importantNotice.slug}`} className="block mt-8">
              <div className="group relative overflow-hidden rounded-3xl border border-brand-border bg-brand-bg p-6 md:p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(118,185,0,0.08)] hover:border-brand/30 hover:bg-brand-bg/85">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-brand/10 border border-brand/20 text-brand-text shrink-0">
                      <Megaphone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex rounded-full bg-brand/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-text">
                          Important Announcement
                        </span>
                        <span className="text-xs text-muted">
                          {getRelativeTime(importantNotice.posted_at || importantNotice.created_at)}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg sm:text-xl font-bold text-foreground line-clamp-2">
                        {importantNotice.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
                        {importantNotice.description || "Click to view full official notification details, eligibility criteria, and PDF downloads."}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand group-hover:bg-brand/90 text-primary-foreground px-5 py-3 text-sm font-bold transition-all shadow-lg shadow-brand/10 shrink-0 self-start md:self-center">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          <NoticesList
            search={search}
            category="recruitment"
            page={page}
            sort={sort}
            excludeId={importantNotice?.id}
            basePath="/jobs"
          />
        </Container>

        <Footer />
      </main>
    </>
  );
}
