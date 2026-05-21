import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { getNoticeBySlug, getRelatedNotices } from "@/services/notices";
import { createClient } from "@/lib/supabase/server";
import { getCategoryStyles } from "@/components/notices/notices-list";
import { SaveNoticeButton } from "@/components/notices/save-notice-button";
import { NoticeStructuredData } from "@/components/shared/structured-data";
import { supabase } from "@/lib/supabase";

type MetadataProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const notice = await getNoticeBySlug(slug);

  if (!notice) {
    return {
      title: "Notice Not Found",
    };
  }

  return {
    title: `${notice.title} | AssamStudentHub`,
    description: notice.description || "Latest Assam government and university announcements.",
    openGraph: {
      title: notice.title,
      description: notice.description || "Latest Assam government and university announcements.",
      type: "article",
    },
  };
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NoticePage({ params }: PageProps) {
  const { slug } = await params;
  const notice = await getNoticeBySlug(slug);

  if (!notice) {
    notFound();
  }

  // --- 308 Permanent Redirect for merged duplicate notices ---
  // If this notice is a duplicate merged into an official notice,
  // redirect to the canonical official notice to preserve SEO link equity.
  if (notice.merged_into_notice_id) {
    try {
      const { data: canonicalNotice } = await supabase
        .from("notices")
        .select("slug")
        .eq("id", notice.merged_into_notice_id)
        .single();

      if (canonicalNotice?.slug) {
        redirect(`/notices/${canonicalNotice.slug}`);
      }
    } catch {
      // If redirect target not found, fall through and render this notice normally
    }
  }

  const supabaseServer = await createClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  let isSaved = false;
  if (user && notice) {
    const { data } = await supabaseServer
      .from("saved_notices")
      .select("id")
      .eq("user_id", user.id)
      .eq("notice_id", notice.id)
      .maybeSingle();

    isSaved = !!data;
  }

  const canonicalUrl = `https://assamstudenthub.com/notices/${notice.slug}`;

  // Fetch related notices for the sidebar
  const relatedNotices = await getRelatedNotices(
    notice.id,
    notice.title,
    notice.institution_id,
    notice.category
  );

  return (
    <>
      {/* JSON-LD Structured Data */}
      <NoticeStructuredData notice={notice} />

      <Navbar />

      <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 selection:text-red-400">
        {/* Canonical Link Tag */}
        <link rel="canonical" href={canonicalUrl} />
        <Container className="py-14">
          {/* BREADCRUMB */}
          <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/notices" className="hover:text-white transition">
              Notices
            </Link>
            <span>/</span>
            <span className="text-zinc-400 truncate max-w-[240px] md:max-w-md">
              {notice.title}
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* MAIN CONTENT */}
            <div>
              {/* CATEGORY */}
              <div className={`mb-6 inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                {notice.category || "Notice"}
              </div>

              {/* TITLE */}
              <h1 className="max-w-4xl text-3xl sm:text-4xl font-black leading-tight tracking-tight text-zinc-100">
                {notice.title}
              </h1>

              {/* META INFO */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                <span>{notice.source}</span>
                <span className="text-zinc-700">•</span>
                <span>
                  {notice.posted_at
                    ? new Date(notice.posted_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : new Date(notice.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                </span>
              </div>

              {/* TAGS */}
              {notice.tags && notice.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {notice.tags.map((tag: string) => (
                    <div
                      key={tag}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-zinc-300"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-8 shadow-xl">
                <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800/60 pb-3">
                  Announcement Details
                </h2>

                <p className="mt-6 leading-8 text-zinc-300 text-sm whitespace-pre-wrap">
                  {notice.description || "No further text description is available for this notice. Please consult the official attached PDF or URL source link for full details."}
                </p>
              </div>

              {/* ATTACHMENT INFO */}
              {notice.attachment_url && (
                <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm p-8 shadow-xl">
                  <h2 className="text-xl font-bold text-zinc-200 border-b border-zinc-800/60 pb-3">
                    Attached Document
                  </h2>
                  <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
                    An official document is attached to this notice. You can view or download it directly to view schedules, guidelines, and tables.
                  </p>
                  <div className="mt-6">
                    <a
                      href={notice.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:bg-zinc-700 hover:text-white"
                    >
                      📁 View Attachment PDF
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside>
              <div className="sticky top-24 rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm p-6 shadow-xl space-y-6">
                <div className="flex flex-col gap-3">
                  {notice.attachment_url ? (
                    <a
                      href={notice.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block rounded-2xl bg-red-500 px-6 py-3.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/10"
                    >
                      Download PDF
                    </a>
                  ) : null}

                  <a
                    href={notice.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full block rounded-2xl px-6 py-3.5 text-center text-sm font-semibold transition-all duration-300 ${
                      notice.attachment_url
                        ? "border border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-zinc-100"
                        : "bg-red-500 text-white hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/10"
                    }`}
                  >
                    Official Source Website
                  </a>

                  {user ? (
                    <SaveNoticeButton noticeId={notice.id} isSaved={isSaved} />
                  ) : (
                    <Link
                      href="/login"
                      className="w-full block rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/20 px-6 py-3.5 text-center text-sm font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all duration-300"
                    >
                      Sign in to save notice
                    </Link>
                  )}
                </div>

                <div className="border-t border-zinc-800/60 pt-6 space-y-5">
                  <div>
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                      Publishing Source
                    </p>
                    <p className="mt-2 text-zinc-200 text-sm font-medium">
                      {notice.source}
                    </p>
                  </div>

                  {notice.institutions?.name && (
                    <div>
                      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                        Institution
                      </p>
                      <p className="mt-2 text-zinc-200 text-sm font-medium">
                        {notice.institutions.name}
                      </p>
                      {notice.institutions.location && (
                        <p className="mt-1 text-xs text-zinc-400">
                          📍 {notice.institutions.location}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                      Category
                    </p>
                    <p className="mt-2 text-zinc-200 text-sm font-medium capitalize">
                      {notice.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                      Published Date
                    </p>
                    <p className="mt-2 text-zinc-200 text-sm font-medium">
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
                    </p>
                  </div>

                  {notice.scraper_name && (
                    <div>
                      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                        Aggregator Node
                      </p>
                      <p className="mt-2 text-zinc-400 text-xs font-medium">
                        {notice.scraper_name.toUpperCase()} Scraper
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* RELATED NOTICES */}
              {relatedNotices.length > 0 && (
                <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-800/60 pb-3 mb-4">
                    🔗 Related Notices
                  </h3>
                  <div className="space-y-4">
                    {relatedNotices.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/notices/${related.slug}`}
                        className="group block space-y-1"
                      >
                        <h4 className="text-xs font-semibold text-zinc-400 group-hover:text-red-400 transition-colors duration-200 line-clamp-2">
                          {related.title}
                        </h4>
                        <div className="flex items-center gap-2 text-zinc-600 text-xs">
                          <span className="capitalize">{related.category}</span>
                          {related.posted_at && (
                            <>
                              <span>·</span>
                              <span>
                                {new Date(related.posted_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </Container>

        <Footer />
      </main>
    </>
  );
}
