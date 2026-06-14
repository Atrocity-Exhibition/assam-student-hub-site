import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MapPin, FileText, Link2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { getNoticeBySlug, getRelatedNotices } from "@/services/notices";
import { createClient } from "@/lib/supabase/server";
import { getCategoryStyles } from "@/components/notices/notices-list";
import { SaveNoticeButton } from "@/components/notices/save-notice-button";
import { NoticeStructuredData } from "@/components/shared/structured-data";
import { supabase } from "@/lib/supabase";
import { getRelativeTime } from "@/lib/utils";
import { InstitutionLogo } from "@/components/shared/institution-logo";
import { AdCard } from "@/components/shared/ad-card";
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
    alternates: {
      canonical: `https://assamstudenthub.xyz/jobs/${notice.slug}`,
    },
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
        redirect(`/jobs/${canonicalNotice.slug}`);
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

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14">
          {/* BREADCRUMB */}
          <div className="mb-8 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-foreground transition-colors">
              Jobs
            </Link>
            <span>/</span>
            <span className="text-foreground/70 truncate max-w-[240px] md:max-w-md">
              {notice.title}
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_340px] items-start w-full min-w-0">
            {/* MAIN CONTENT */}
            <div className="w-full min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                {notice.institutions?.name && (
                  <InstitutionLogo
                    logoUrl={notice.institutions.logo_url}
                    name={notice.institutions.name}
                    className="h-14 w-14 rounded-full bg-white dark:bg-white p-1 shadow-md border border-border/40 shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  {/* CATEGORY */}
                  <div className={`mb-3 inline-flex rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                    {notice.category || "Notice"}
                  </div>

                  {/* TITLE */}
                  <h1 className="max-w-4xl text-3xl sm:text-4xl font-black leading-tight tracking-tight text-foreground">
                    {notice.title}
                  </h1>

                  {/* META INFO */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted font-semibold uppercase tracking-wider">
                    {notice.institutions?.name && (
                      <span className="text-foreground font-bold">{notice.institutions.name}</span>
                    )}
                    {notice.institutions?.name && <span className="text-border">•</span>}
                    <span>{notice.source}</span>
                    <span className="text-border">•</span>
                    <span>
                      {getRelativeTime(notice.posted_at || notice.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* TAGS */}
              {notice.tags && notice.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {notice.tags.map((tag: string) => (
                    <div
                      key={tag}
                      className="rounded-xl border border-border bg-card/50 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-foreground/80"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}              {/* Announcement Details */}
              <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/30 backdrop-blur-sm p-4 sm:p-6 shadow-lg mb-6">
                <h2 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Announcement Details</h2>
                <p className="whitespace-pre-wrap text-foreground/90 text-sm leading-relaxed mb-4">
                  {notice.description || 'No description available.'}
                </p>

                {/* Inline Category-Specific Details */}
                {(() => {
                  const cat = (notice.category || '').toLowerCase();
                  const md = (notice.metadata || {}) as Record<string, string | number | null>;
                  
                  const hasJobFields = md.salary || md.vacancies || md.qualification || md.last_date || md.advt_no || md.age_limit;
                  const hasExamFields = md.exam_date || md.admit_card_date || md.last_date || md.qualification || md.exam_mode || md.age_limit;
                  const hasScholarshipFields = md.award_amount || md.level || md.qualification || md.last_date || md.application_mode;

                  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
                    <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2 py-2.5 border-t border-border/40 hover:bg-emerald-500/5 transition-colors duration-200 px-2 rounded-md">
                      <div className="font-semibold text-muted uppercase text-[10px] tracking-wider flex items-center">{label}</div>
                      <div className="sm:col-span-2 text-foreground text-sm font-medium break-all">{value}</div>
                    </div>
                  );

                  if ((cat === 'recruitment' || cat === 'job') && hasJobFields) {
                    return (
                      <div className="mt-6 pt-4 border-t border-border/60 space-y-1">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Job Details</h3>
                        {md.salary && Row({ label: 'Pay Scale', value: md.salary })}
                        {md.vacancies && Row({ label: 'Vacancies', value: md.vacancies })}
                        {md.qualification && Row({ label: 'Qualification', value: md.qualification })}
                        {md.last_date && Row({ label: 'Apply By', value: md.last_date })}
                        {md.advt_no && Row({ label: 'Advt No.', value: md.advt_no })}
                        {md.age_limit && Row({ label: 'Age Limit', value: md.age_limit })}
                      </div>
                    );
                  }

                  if (cat === 'exam' && hasExamFields) {
                    return (
                      <div className="mt-6 pt-4 border-t border-border/60 space-y-1">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Exam Details</h3>
                        {md.exam_date && Row({ label: 'Exam Date', value: md.exam_date })}
                        {md.admit_card_date && Row({ label: 'Admit Card', value: md.admit_card_date })}
                        {md.last_date && Row({ label: 'Deadline', value: md.last_date })}
                        {md.qualification && Row({ label: 'Eligibility', value: md.qualification })}
                        {md.exam_mode && Row({ label: 'Mode', value: md.exam_mode })}
                        {md.age_limit && Row({ label: 'Age Limit', value: md.age_limit })}
                      </div>
                    );
                  }

                  if (cat === 'scholarship' && hasScholarshipFields) {
                    return (
                      <div className="mt-6 pt-4 border-t border-border/60 space-y-1">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Scholarship Details</h3>
                        {md.award_amount && Row({ label: 'Award', value: md.award_amount })}
                        {md.level && Row({ label: 'Level', value: md.level })}
                        {md.qualification && Row({ label: 'Eligibility', value: md.qualification })}
                        {md.last_date && Row({ label: 'Last Date', value: md.last_date })}
                        {md.application_mode && Row({ label: 'Apply Via', value: md.application_mode })}
                      </div>
                    );
                  }

                  return null;
                })()}
              </div>

              {/* ATTACHMENT INFO */}
              {notice.attachment_url && (
                <div className="mt-6 rounded-2xl sm:rounded-3xl border border-border bg-card/30 backdrop-blur-sm p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h2 className="text-xl font-bold text-foreground border-b border-border pb-3">
                    Attached Document
                  </h2>
                  <p className="mt-4 text-muted text-sm leading-relaxed">
                    An official document is attached to this notice. You can view or download it directly to view schedules, guidelines, and tables.
                  </p>
                  <div className="mt-6">
                    <a
                      href={notice.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-500"
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      View Attachment PDF
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="w-full min-w-0 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide space-y-6">
              <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6 shadow-xl space-y-6">
                <div className="flex flex-col gap-3">
                  {notice.attachment_url ? (
                    <a
                      href={notice.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full block rounded-2xl px-6 py-3.5 text-center text-sm font-semibold transition-all duration-300 ${
                        (notice.metadata && (notice.metadata as any).apply_url)
                          ? "border border-border bg-background text-foreground hover:bg-muted/10"
                          : "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
                      }`}
                    >
                      Download PDF
                    </a>
                  ) : null}

                  {notice.metadata && (notice.metadata as any).apply_url ? (
                    <a
                      href={(notice.metadata as any).apply_url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block rounded-2xl bg-emerald-600 px-6 py-3.5 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
                    >
                      Apply Online
                    </a>
                  ) : null}

                  <a
                    href={notice.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full block rounded-2xl px-6 py-3.5 text-center text-sm font-semibold transition-all duration-300 ${
                      notice.attachment_url || (notice.metadata && (notice.metadata as any).apply_url)
                        ? "border border-border bg-background text-foreground hover:bg-muted/10"
                        : "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
                    }`}
                  >
                    Official Source Website
                  </a>

                  {user ? (
                    <SaveNoticeButton noticeId={notice.id} isSaved={isSaved} />
                  ) : (
                    <Link
                      href="/login"
                      className="w-full block rounded-2xl border border-dashed border-border bg-card/20 px-6 py-3.5 text-center text-sm font-medium text-muted hover:border-foreground/30 hover:text-foreground transition-all duration-300"
                    >
                      Sign in to save notice
                    </Link>
                  )}
                </div>

                <div className="border-t border-border pt-6 space-y-5">
                  <div>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                      Publishing Source
                    </p>
                    <p className="mt-2 text-foreground text-sm font-medium">
                      {notice.source}
                    </p>
                  </div>

                  {notice.institutions?.name && (
                    <div>
                      <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                        Institution
                      </p>
                      <div className="mt-2.5 flex items-center gap-3">
                        <InstitutionLogo
                          logoUrl={notice.institutions.logo_url}
                          name={notice.institutions.name}
                          className="h-8 w-8"
                        />
                        <div className="min-w-0">
                          <p className="text-foreground text-sm font-bold leading-tight">
                            {notice.institutions.name}
                          </p>
                          {notice.institutions.location && (
                            <p className="mt-1 text-xs text-muted flex items-center gap-1">
                              <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                              <span className="truncate">{notice.institutions.location}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                      Category
                    </p>
                    <p className="mt-2 text-foreground text-sm font-medium capitalize">
                      {notice.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                      Published Date
                    </p>
                    <p className="mt-2 text-foreground text-sm font-medium">
                      {getRelativeTime(notice.posted_at || notice.created_at)}
                    </p>
                  </div>

                  {notice.scraper_name && (
                    <div>
                      <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                        Aggregator Node
                      </p>
                      <p className="mt-2 text-muted text-xs font-medium">
                        {notice.scraper_name.toUpperCase()} Scraper
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SPONSOR AD */}
              <AdCard variant="sidebar" index={notice.id} />

              {/* RELATED NOTICES */}
              {relatedNotices.length > 0 && (
                <div className="mt-6 rounded-2xl sm:rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-3 mb-4 flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Related Notices</span>
                  </h3>
                  <div className="space-y-4">
                    {relatedNotices.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/jobs/${related.slug}`}
                        className="group block space-y-1"
                      >
                        <h4 className="text-xs font-semibold text-foreground/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                          {related.title}
                        </h4>
                        <div className="flex items-center gap-2 text-muted text-xs">
                          <span className="capitalize">{related.category}</span>
                          {related.posted_at && (
                            <>
                              <span>·</span>
                              <span>
                                {getRelativeTime(related.posted_at)}
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
