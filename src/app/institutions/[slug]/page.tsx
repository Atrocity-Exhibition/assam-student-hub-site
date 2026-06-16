import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/home/footer";
import { getInstitutionBySlug, getInstitutions } from "@/services/institutions";
import { getNotices } from "@/services/notices";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";
import { InstitutionStructuredData } from "@/components/shared/structured-data";
import { getRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InstitutionLogo } from "@/components/shared/institution-logo";



type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const institution = await getInstitutionBySlug(slug);

  if (!institution) {
    return {
      title: "Institution Not Found",
    };
  }

  return {
    title: `${institution.name} | AssamStudentHub`,
    description: institution.description || `Explore latest updates, exams, results, admissions, and recruitment notifications from ${institution.name}.`,
    alternates: {
      canonical: `https://assamstudenthub.xyz/institutions/${slug.toLowerCase()}`,
    },
  };
}

export async function generateStaticParams() {
  const institutions = await getInstitutions();
  return institutions.map((institution) => ({
    slug: institution.slug,
  }));
}

export default async function InstitutionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const institution = await getInstitutionBySlug(slug);

  if (!institution) {
    notFound();
  }

  // Parse page number
  const currentPage = Number((await searchParams).page) || 1;

  // Fetch notices linked to this institution with pagination
  const { notices, totalPages } = await getNotices({
    institutionId: institution.id,
    page: currentPage,
    sort: "latest",
  });

  const getPageNumbers = (currentPage: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);
    
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(total - 1, currentPage + 1);
    
    if (currentPage <= 4) {
      start = 2;
      end = 5;
    } else if (currentPage >= total - 3) {
      start = total - 4;
      end = total - 1;
    }
    
    if (start > 2) {
      pages.push("...");
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < total - 1) {
      pages.push("...");
    }
    pages.push(total);
    return pages;
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <>
      {/* JSON-LD Structured Data for Institution */}
      <InstitutionStructuredData institution={institution} />

      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-brand/30 selection:text-brand-text">
        <Container className="py-14">
          {/* HERO */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 max-w-4xl">
            <InstitutionLogo
              logoUrl={institution.logo_url}
              name={institution.name}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white dark:bg-white p-1 shadow-md border border-border/40 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="inline-flex rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
                Institution Profile
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
                {institution.name}
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted">
                {institution.description || "Official educational board or government department of the State of Assam."}
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-sm px-5 py-3 text-sm text-muted font-medium flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{institution.location || "Assam, India"}</span>
                </div>

                {institution.website && (
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/10"
                  >
                    Visit Official Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ACTIVE UPDATES FEED */}
          <section className="mt-20">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Active Updates & Announcements
            </h2>
            <p className="mt-2 text-sm text-muted">
              Real-time feed of parsed announcements retrieved from {institution.name}.
            </p>

            {notices.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-border bg-card/30 backdrop-blur-sm p-10 text-center shadow-md">
                <h3 className="text-xl font-bold text-foreground">No active updates found</h3>
                <p className="mt-3 text-muted text-sm max-w-xl mx-auto leading-relaxed">
                  We currently haven&apos;t scraped any active alerts, results, or exam routines for this institution. Check back soon as our automated pipeline indexes portals daily.
                </p>
                <div className="mt-8 flex justify-center gap-2 flex-wrap">
                  {["Admissions", "Exam Routines", "Results", "Recruitment", "Scholarships"].map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full border border-border bg-card/25 px-3 py-1.5 text-xs text-muted"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {notices.map((notice) => {
                    const hoverClasses = getCategoryHoverClasses(notice.category);
                    
                    return (
                      <Link key={notice.id} href={`/jobs/${notice.slug}`}>
                        <article className={`group h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-4 sm:p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/5 shadow-sm ${hoverClasses.border}`}>
                          <div className="flex gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="mb-3.5 flex items-center justify-between gap-4">
                                <div className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                                  {notice.category || "Notice"}
                                </div>
                              </div>

                              <h3 className={`text-base sm:text-lg font-extrabold leading-snug text-foreground transition-colors duration-300 line-clamp-2 ${hoverClasses.text}`}>
                                {notice.title}
                              </h3>

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

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    {/* Previous button */}
                    {currentPage > 1 ? (
                      <Link
                        href={`/institutions/${slug}?page=${currentPage - 1}`}
                        className="transition-transform active:scale-95 duration-100"
                      >
                        <Button
                          variant="secondary"
                          className="h-9 px-3 text-xs font-bold rounded-xl flex items-center gap-1"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Prev</span>
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        disabled
                        variant="secondary"
                        className="h-9 px-3 text-xs font-bold rounded-xl flex items-center gap-1 opacity-50 cursor-not-allowed"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Prev</span>
                      </Button>
                    )}

                    {/* Page buttons */}
                    {pageNumbers.map((pageNumber, index) => {
                      if (pageNumber === "...") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="inline-flex items-center justify-center h-9 w-9 text-zinc-400 dark:text-zinc-500 text-xs font-semibold"
                          >
                            ...
                          </span>
                        );
                      }

                      const isActive = pageNumber === currentPage;

                      return (
                        <Link
                          key={pageNumber}
                          href={`/institutions/${slug}?page=${pageNumber}`}
                          className="relative inline-flex items-center justify-center transition-transform active:scale-95 duration-100 after:absolute after:-inset-2.5 after:content-['']"
                        >
                          <Button
                            variant={isActive ? "primary" : "secondary"}
                            className="h-9 w-9 p-0 text-xs font-bold rounded-xl"
                          >
                            {pageNumber}
                          </Button>
                        </Link>
                      );
                    })}

                    {/* Next button */}
                    {currentPage < totalPages ? (
                      <Link
                        href={`/institutions/${slug}?page=${currentPage + 1}`}
                        className="transition-transform active:scale-95 duration-100"
                      >
                        <Button
                          variant="secondary"
                          className="h-9 px-3 text-xs font-bold rounded-xl flex items-center gap-1"
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        disabled
                        variant="secondary"
                        className="h-9 px-3 text-xs font-bold rounded-xl flex items-center gap-1 opacity-50 cursor-not-allowed"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </Container>

        <Footer />
      </main>
    </>
  );
}
