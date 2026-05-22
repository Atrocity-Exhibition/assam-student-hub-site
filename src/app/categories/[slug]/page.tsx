import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { getNotices, applyCompetitiveExamFilters } from "@/services/notices";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";
import { CategorySearch, CategorySort } from "./category-controls";
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/types/notice";
import { getRelativeTime, extractSalary } from "@/lib/utils";
import { TrendingUp, Clock, Banknote } from "lucide-react";


type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
};

const categoryAccentColors: Record<string, string> = {
  recruitment: "bg-emerald-500",
  result: "bg-blue-500",
  exam: "bg-amber-500",
  admission: "bg-purple-500",
  scholarship: "bg-pink-500",
  notice: "bg-zinc-500",
};

// Map URL slug to DB category casing
function mapSlugToCategory(slug: string): string {
  const slugLower = slug.toLowerCase();
  switch (slugLower) {
    case "recruitment":
      return "Recruitment";
    case "results":
      return "Result";
    case "exams":
      return "Exam";
    case "admissions":
      return "Admission";
    case "scholarships":
      return "Scholarship";
    case "notices":
      return "Notice";
    default:
      return slug.charAt(0).toUpperCase() + slug.slice(1);
  }
}

// Map slug to a user-friendly plural title
function getCategoryTitle(slug: string): string {
  const slugLower = slug.toLowerCase();
  switch (slugLower) {
    case "recruitment":
      return "Recruitment & Jobs";
    case "results":
      return "Exam Results";
    case "exams":
      return "Exams & Timetables";
    case "admissions":
      return "University Admissions";
    case "scholarships":
      return "Scholarships & Grants";
    case "notices":
      return "General Academic Notices";
    default:
      return `${slug.charAt(0).toUpperCase() + slug.slice(1)} Updates`;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = mapSlugToCategory(slug);
  const title = getCategoryTitle(slug);
  return {
    title: `${title} | AssamStudentHub`,
    description: `Stay updated with the latest verified ${categoryName.toLowerCase()} notifications, announcements, results, timetables, and official notices from universities and boards in Assam.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = await searchParams;

  const validSlugs = ["recruitment", "results", "exams", "admissions", "scholarships", "notices"];
  if (!validSlugs.includes(slug.toLowerCase())) {
    notFound();
  }

  const dbCategory = mapSlugToCategory(slug);
  const page = Number(sParams.page || "1");
  const sort = sParams.sort || "newest";
  const search = sParams.search || "";

  // 1. Fetch paginated notices in this category
  const { notices, totalPages } = await getNotices({
    category: dbCategory,
    page,
    sort,
    search,
  });

  // 2. Fetch sidebar: Trending Institutions (Most active notices in this category)
  let trendingInstitutions: { name: string; slug: string; count: number }[] = [];
  try {
    let trendingQuery = supabase
      .from("notices")
      .select("institution, institution_slug, institution_id")
      .ilike("category", dbCategory)
      .eq("is_active", true);

    trendingQuery = applyCompetitiveExamFilters(trendingQuery, dbCategory);

    const { data: noticesForCategory } = await trendingQuery;

    const instCounts: { [id: number]: { name: string; slug: string; count: number } } = {};
    noticesForCategory?.forEach((n) => {
      if (n.institution_id) {
        if (!instCounts[n.institution_id]) {
          instCounts[n.institution_id] = {
            name: n.institution,
            slug: n.institution_slug || "",
            count: 0,
          };
        }
        instCounts[n.institution_id].count++;
      }
    });

    trendingInstitutions = Object.values(instCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  } catch (err) {
    console.error("Error fetching trending institutions for sidebar:", err);
  }

  // 3. Fetch sidebar: Recent Updates (Newest 5 notices in this category)
  let recentUpdates: Partial<Notice>[] = [];
  try {
    let recentQuery = supabase
      .from("notices")
      .select("title, slug, posted_at, created_at")
      .ilike("category", dbCategory)
      .eq("is_active", true);

    recentQuery = applyCompetitiveExamFilters(recentQuery, dbCategory);

    const { data: recentData } = await recentQuery
      .order("posted_at", { ascending: false, nullsFirst: false })
      .limit(5);
    recentUpdates = recentData || [];
  } catch (err) {
    console.error("Error fetching recent updates for sidebar:", err);
  }

  // Related categories mapping
  const allCategories = [
    { name: "Recruitment & Jobs", slug: "recruitment" },
    { name: "Exam Results", slug: "results" },
    { name: "Exams & Timetables", slug: "exams" },
    { name: "University Admissions", slug: "admissions" },
    { name: "Scholarships", slug: "scholarships" },
    { name: "General Notices", slug: "notices" },
  ];
  const relatedCategories = allCategories.filter((cat) => cat.slug !== slug.toLowerCase());

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              Category Announcements
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              {getCategoryTitle(slug)}
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted max-w-2xl">
              Discover verified notifications, official announcements, schedules, and circulars for{" "}
              <strong className="text-foreground">{dbCategory.toLowerCase()}</strong> sourced directly from university
              boards and government web portals in Assam.
            </p>
          </div>

          {/* TWO COLUMN GRID */}
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* LEFT COLUMN: Notices List */}
            <div>
              {/* FILTER CONTROLS */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <CategorySearch initialSearch={search} categorySlug={slug} />
                </div>
                <div className="shrink-0">
                  <CategorySort currentSort={sort} search={search} categorySlug={slug} />
                </div>
              </div>

              {/* EMPTY STATE */}
              {notices.length === 0 && (
                <div className="mt-12 rounded-3xl border border-border bg-card/30 backdrop-blur-sm p-12 text-center shadow-md">
                  <h2 className="text-2xl font-bold text-foreground">No notices found</h2>
                  <p className="mt-4 text-muted text-sm max-w-md mx-auto">
                    We couldn&apos;t find any announcements matching your query in this category. Try adjusting your search query.
                  </p>
                </div>
              )}

              {/* GRID OF CARDS */}
              {notices.length > 0 && (
                <>
                  <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {notices.map((notice: Notice) => {
                      const hoverClasses = getCategoryHoverClasses(notice.category);
                      const accentColor = categoryAccentColors[(notice.category || "").toLowerCase()] || "bg-zinc-500";
                      
                      return (
                        <Link key={notice.id} href={`/notices/${notice.slug}`}>
                          <article className={`group h-full flex flex-col justify-between rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/5 shadow-sm ${hoverClasses.border}`}>
                            <div className="flex gap-4">
                              {/* Left accent strip */}
                              <div className={`w-1 shrink-0 rounded-full ${accentColor} opacity-90 group-hover:scale-y-[1.03] transition-transform duration-300`} />
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-3.5">
                                  <div
                                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(
                                      notice.category
                                    )}`}
                                  >
                                    {notice.category || "Notice"}
                                  </div>

                                  {notice.institutions?.name && (
                                    <span className="text-xs text-muted font-medium truncate max-w-[200px]">
                                      {notice.institutions.name}
                                    </span>
                                  )}
                                </div>

                                <h2 className={`text-base sm:text-lg font-extrabold leading-snug text-foreground transition-colors duration-300 line-clamp-2 ${hoverClasses.text}`}>
                                  {notice.title}
                                </h2>

                                <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-muted transition-colors duration-200">
                                  {notice.description ||
                                    "No description provided. Click to view the full announcement details and official attachments."}
                                </p>

                                {(() => {
                                  const salary = extractSalary(notice.title, notice.description, notice.metadata);
                                  return salary ? (
                                    <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 border border-emerald-500/20">
                                      <Banknote className="h-3.5 w-3.5 shrink-0" />
                                      <span>Salary/Stipend: {salary}</span>
                                    </div>
                                  ) : null;
                                })()}
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

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-3">
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        const isActive = pageNumber === page;
                        const params = new URLSearchParams();

                        if (search) {
                          params.set("search", search);
                        }

                        if (sort && sort !== "newest") {
                          params.set("sort", sort);
                        }

                        params.set("page", String(pageNumber));

                        return (
                          <Link
                            key={pageNumber}
                            href={`/categories/${slug}?${params.toString()}`}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition-all duration-300 ${
                              isActive
                                ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/10"
                                : "border-border bg-card text-muted hover:border-foreground/30 hover:bg-muted/10 hover:text-foreground"
                            }`}
                          >
                            {pageNumber}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar Widgets */}
            <aside className="space-y-8">
              {/* Trending Institutions */}
              {trendingInstitutions.length > 0 && (
                <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-3 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Trending Institutions
                  </h3>
                  <div className="space-y-4">
                    {trendingInstitutions.map((inst) => (
                      <Link
                        key={inst.slug}
                        href={`/institutions/${inst.slug}`}
                        className="group flex items-center justify-between gap-3 text-sm transition-all duration-300"
                      >
                        <span className="text-muted group-hover:text-foreground group-hover:underline truncate max-w-[200px]">
                          {inst.name}
                        </span>
                        <span className="rounded-full bg-background border border-border px-2 py-0.5 text-xs text-muted font-semibold group-hover:border-foreground/30 group-hover:text-foreground">
                          {inst.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Updates */}
              {recentUpdates.length > 0 && (
                <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-3 mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    Recent Updates
                  </h3>
                  <div className="space-y-4">
                    {recentUpdates.map((notice) => (
                      <Link
                        key={notice.slug}
                        href={`/notices/${notice.slug}`}
                        className="group block text-xs space-y-1"
                      >
                        <h4 className="font-semibold text-muted group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                          {notice.title}
                        </h4>
                        <span className="text-muted/60 block">
                          {getRelativeTime(notice.posted_at || notice.created_at || null)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* RELATED CATEGORIES */}
          <div className="mt-16 border-t border-border pt-10">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">Related Categories</h3>
            <div className="flex flex-wrap gap-4">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-muted transition-all duration-300 hover:border-foreground/30 hover:bg-muted/10 hover:text-foreground"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </Container>

        <Footer />
      </main>
    </>
  );
}
