import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/home/footer";
import { getInstitutionBySlug, getInstitutions } from "@/services/institutions";
import { getNotices } from "@/services/notices";
import { getCategoryStyles } from "@/components/notices/notices-list";
import { InstitutionStructuredData } from "@/components/shared/structured-data";

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

      <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 selection:text-red-400">
        <Container className="py-14">
          {/* HERO */}
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Institution Profile
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              {institution.name}
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-400">
              {institution.description || "Official educational board or government department of the State of Assam."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm px-5 py-3 text-sm text-zinc-400 font-medium">
                📍 {institution.location || "Assam, India"}
              </div>

              {institution.website && (
                <a
                  href={institution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-red-500 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/10"
                >
                  Visit Official Website
                </a>
              )}
            </div>
          </div>

          {/* ACTIVE UPDATES FEED */}
          <section className="mt-20">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-200">
              Active Updates & Announcements
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Real-time feed of parsed announcements retrieved from {institution.name}.
            </p>

            {notices.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-sm p-10 text-center">
                <h3 className="text-xl font-bold text-zinc-300">No active updates found</h3>
                <p className="mt-3 text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
                  We currently haven't scraped any active alerts, results, or exam routines for this institution. Check back soon as our automated pipeline indexes portals daily.
                </p>
                <div className="mt-8 flex justify-center gap-2 flex-wrap">
                  {["Admissions", "Exam Routines", "Results", "Recruitment", "Scholarships"].map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full border border-zinc-800/60 bg-zinc-900/20 px-3 py-1.5 text-xs text-zinc-500"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {notices.map((notice) => (
                    <Link key={notice.id} href={`/notices/${notice.slug}`}>
                      <article className="group h-full flex flex-col justify-between rounded-3xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700/80 hover:bg-zinc-900/45 hover:shadow-2xl hover:shadow-black/35">
                        <div>
                          <div className="mb-4">
                            <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                              {notice.category || "Notice"}
                            </div>
                          </div>

                          <h3 className="text-lg font-bold leading-snug text-zinc-200 group-hover:text-red-400 transition-colors duration-300">
                            {notice.title}
                          </h3>

                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                            {notice.description || "No description provided. Click to view the full announcement details and official attachments."}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-zinc-800/40 pt-4 text-xs text-zinc-500 font-medium">
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
                  ))}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    {currentPage > 1 ? (
                      <Link
                        href={`/institutions/${slug}?page=${currentPage - 1}`}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-white"
                      >
                        Previous
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="rounded-2xl border border-zinc-900 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-600 cursor-not-allowed opacity-50"
                      >
                        Previous
                      </button>
                    )}

                    <div className="text-sm font-medium text-zinc-400">
                      Page <span className="text-zinc-200">{currentPage}</span> of{" "}
                      <span className="text-zinc-200">{totalPages}</span>
                    </div>

                    {currentPage < totalPages ? (
                      <Link
                        href={`/institutions/${slug}?page=${currentPage + 1}`}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-white"
                      >
                        Next
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="rounded-2xl border border-zinc-900 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-600 cursor-not-allowed opacity-50"
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
