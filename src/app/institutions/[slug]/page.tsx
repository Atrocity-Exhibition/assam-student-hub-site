import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/home/footer";
import { getInstitutionBySlug, getInstitutions } from "@/services/institutions";
import { getNotices } from "@/services/notices";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";
import { InstitutionStructuredData } from "@/components/shared/structured-data";
import { getRelativeTime } from "@/lib/utils";

const categoryAccentColors: Record<string, string> = {
  recruitment: "bg-emerald-500",
  result: "bg-blue-500",
  exam: "bg-amber-500",
  admission: "bg-purple-500",
  scholarship: "bg-pink-500",
  notice: "bg-zinc-500",
};

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
      canonical: `https://assamstudenthub.com/institutions/${slug.toLowerCase()}`,
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

  return (
    <>
      {/* JSON-LD Structured Data for Institution */}
      <InstitutionStructuredData institution={institution} />

      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14">
          {/* HERO */}
          <div className="max-w-4xl">
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
                  className="rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  Visit Official Website
                </a>
              )}
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
                    const accentColor = categoryAccentColors[(notice.category || "").toLowerCase()] || "bg-zinc-500";
                    
                    return (
                      <Link key={notice.id} href={`/jobs/${notice.slug}`}>
                        <article className={`group h-full flex flex-col justify-between rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/5 shadow-sm ${hoverClasses.border}`}>
                          <div className="flex gap-4">
                            {/* Left accent strip */}
                            <div className={`w-1 shrink-0 rounded-full ${accentColor} opacity-90 group-hover:scale-y-[1.03] transition-transform duration-300`} />
                            
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
                  <div className="mt-12 flex items-center justify-center gap-4">
                    {currentPage > 1 ? (
                      <Link
                        href={`/institutions/${slug}?page=${currentPage - 1}`}
                        className="rounded-2xl border border-border bg-card/40 px-5 py-3 text-sm font-semibold text-muted transition hover:border-foreground/30 hover:bg-card/60 hover:text-foreground"
                      >
                        Previous
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="rounded-2xl border border-border bg-muted/10 px-5 py-3 text-sm font-semibold text-muted/40 cursor-not-allowed opacity-50"
                      >
                        Previous
                      </button>
                    )}

                    <div className="text-sm font-medium text-muted">
                      Page <span className="text-foreground">{currentPage}</span> of{" "}
                      <span className="text-foreground">{totalPages}</span>
                    </div>

                    {currentPage < totalPages ? (
                      <Link
                        href={`/institutions/${slug}?page=${currentPage + 1}`}
                        className="rounded-2xl border border-border bg-card/40 px-5 py-3 text-sm font-semibold text-muted transition hover:border-foreground/30 hover:bg-card/60 hover:text-foreground"
                      >
                        Next
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="rounded-2xl border border-border bg-muted/10 px-5 py-3 text-sm font-semibold text-muted/40 cursor-not-allowed opacity-50"
                      >
                        Next
                      </button>
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
