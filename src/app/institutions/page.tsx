import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Megaphone, ArrowRight } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/home/footer";
import { getInstitutions } from "@/services/institutions";
import { NoticesList } from "@/components/notices/notices-list";
import { getImportantNotice } from "@/services/notices";
import { getRelativeTime } from "@/lib/utils";
import { InstitutionLogo } from "@/components/shared/institution-logo";

export const metadata: Metadata = {
  title: "Universities & Boards in Assam | AssamStudentHub",
  description:
    "Directory of educational boards, universities, and colleges in Assam. Access official notices, exam routines, results, and notifications directly from each institution.",
  alternates: {
    canonical: "https://assamstudenthub.xyz/institutions",
  },
};

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function InstitutionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "academic";
  const page = Number(params.page || "1");
  const sort = params.sort || "newest";

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

  // Filter out recruitment boards, aggregators, and PSUs from display
  const institutions = (await getInstitutions()).filter(
    (inst) => !NON_ACADEMIC_SLUGS.includes(inst.slug)
  );

  // Fetch featured important academic notice
  const importantNotice = await getImportantNotice("academic");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-brand/30 selection:text-brand-text">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-border bg-card/50 px-4 py-2 text-sm text-muted font-semibold uppercase tracking-wider">
              Assam Institutions
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight text-foreground">
              Browse Institutions
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              Explore universities, colleges, and educational boards across Assam. Access official notices, exam schedules, and results directly from each campus portal.
            </p>
          </div>

          {/* GRID */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {institutions.map((institution) => (
              <Link
                key={institution.id}
                href={`/institutions/${institution.slug}`}
              >
                <article className="group h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border bg-card/40 p-5 sm:p-7 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-border dark:hover:border-brand-border/40 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 shadow-sm min-h-[220px]">
                  <div>
                    <div className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted font-bold uppercase tracking-wider">
                      Institution
                    </div>

                    <div className="mt-5 flex items-start gap-4">
                      <InstitutionLogo
                        logoUrl={institution.logo_url}
                        name={institution.name}
                        className="h-12 w-12"
                      />
                      <h2 className="text-2xl font-black text-foreground transition group-hover:text-brand-text leading-tight">
                        {institution.name}
                      </h2>
                    </div>

                    <p className="mt-4 leading-7 text-muted text-sm line-clamp-3">
                      {institution.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-xs text-muted font-semibold uppercase tracking-wider border-t border-border pt-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span>{institution.location || "Assam, India"}</span>
                    </span>

                    <span className="group-hover:text-brand-text transition-colors">
                      View Updates &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* ACADEMIC FEED SECTION */}
          <div className="mt-20 border-t border-border pt-16">
            <div className="max-w-3xl mb-10">
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                Latest Academic Updates
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted">
                Search and filter academic circulars, semester schedules, admissions processes, results notifications, and scholarships across all institutions.
              </p>
            </div>

            {/* Render the featured academic notice banner here (at the top of the feed) */}
            {!search && page === 1 && importantNotice && (
              <Link href={`/jobs/${importantNotice.slug}`} className="block mb-8">
                <div className="group relative overflow-hidden rounded-3xl border border-brand-border bg-brand-bg p-6 md:p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(118,185,0,0.08)] hover:border-brand/30 hover:bg-brand-bg/85">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-brand/10 border border-brand/20 text-brand-text shrink-0">
                        <Megaphone className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex rounded-full bg-brand/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-text">
                            Important Notice
                          </span>
                          <span className="text-xs text-muted">
                            {getRelativeTime(importantNotice.posted_at || importantNotice.created_at)}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg sm:text-xl font-bold text-foreground line-clamp-2">
                          {importantNotice.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
                          {importantNotice.description || "Click to view details and download official attachments."}
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
              category={category}
              page={page}
              sort={sort}
              excludeId={importantNotice?.id}
              basePath="/institutions"
            />
          </div>
        </Container>

        <Footer />
      </main>
    </>
  );
}
