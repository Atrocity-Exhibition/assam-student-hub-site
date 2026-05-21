import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { getNotices } from "@/services/notices";
import { getCategoryStyles } from "@/components/notices/notices-list";
import { CategorySearch, CategorySort } from "./category-controls";
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/types/notice";

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
    const { data: noticesForCategory } = await supabase
      .from("notices")
      .select("institution, institution_slug, institution_id")
      .eq("category", dbCategory.toLowerCase())
      .eq("is_active", true);

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
    const { data: recentData } = await supabase
      .from("notices")
      .select("title, slug, posted_at, created_at")
      .eq("category", dbCategory.toLowerCase())
      .eq("is_active", true)
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

      <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 selection:text-red-400">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Category Announcements
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              {getCategoryTitle(slug)}
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-400 max-w-2xl">
              Discover verified notifications, official announcements, schedules, and circulars for{" "}
              <strong className="text-zinc-200">{dbCategory.toLowerCase()}</strong> sourced directly from university
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
                <div className="mt-12 rounded-3xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-sm p-12 text-center">
                  <h2 className="text-2xl font-bold text-zinc-200">No notices found</h2>
                  <p className="mt-4 text-zinc-500 text-sm max-w-md mx-auto">
                    We couldn't find any announcements matching your query in this category. Try adjusting your search query.
                  </p>
                </div>
              )}

              {/* GRID OF CARDS */}
              {notices.length > 0 && (
                <>
                  <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {notices.map((notice: Notice) => (
                      <Link key={notice.id} href={`/notices/${notice.slug}`}>
                        <article className="group h-full flex flex-col justify-between rounded-3xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700/80 hover:bg-zinc-900/45 hover:shadow-2xl hover:shadow-black/35">
                          <div>
                            <div className="flex items-center justify-between gap-4 mb-4">
                              <div
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getCategoryStyles(
                                  notice.category
                                )}`}
                              >
                                {notice.category || "Notice"}
                              </div>

                              {notice.institutions?.name && (
                                <span className="text-xs text-zinc-500 font-medium truncate max-w-[200px]">
                                  {notice.institutions.name}
                                </span>
                              )}
                            </div>

                            <h2 className="text-xl font-bold leading-snug text-zinc-100 group-hover:text-red-400 transition-colors duration-300">
                              {notice.title}
                            </h2>

                            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                              {notice.description ||
                                "No description provided. Click to view the full announcement details and official attachments."}
                            </p>
                          </div>

                          <div className="mt-8 flex items-center justify-between border-t border-zinc-800/40 pt-4 text-xs text-zinc-500 font-medium">
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
                                ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/10"
                                : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/40 hover:text-zinc-200"
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
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-800/60 pb-3 mb-4">
                    🔥 Trending Institutions
                  </h3>
                  <div className="space-y-4">
                    {trendingInstitutions.map((inst) => (
                      <Link
                        key={inst.slug}
                        href={`/institutions/${inst.slug}`}
                        className="group flex items-center justify-between gap-3 text-sm transition-all duration-300"
                      >
                        <span className="text-zinc-400 group-hover:text-zinc-200 group-hover:underline truncate max-w-[200px]">
                          {inst.name}
                        </span>
                        <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500 font-semibold group-hover:border-zinc-700 group-hover:text-zinc-400">
                          {inst.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Updates */}
              {recentUpdates.length > 0 && (
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-800/60 pb-3 mb-4">
                    🕒 Recent Updates
                  </h3>
                  <div className="space-y-4">
                    {recentUpdates.map((notice) => (
                      <Link
                        key={notice.slug}
                        href={`/notices/${notice.slug}`}
                        className="group block text-xs space-y-1"
                      >
                        <h4 className="font-semibold text-zinc-400 group-hover:text-red-400 transition-colors duration-200 line-clamp-2">
                          {notice.title}
                        </h4>
                        <span className="text-zinc-600 block">
                          {notice.posted_at
                            ? new Date(notice.posted_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : new Date(notice.created_at!).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* RELATED CATEGORIES */}
          <div className="mt-16 border-t border-zinc-900 pt-10">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-6">Related Categories</h3>
            <div className="flex flex-wrap gap-4">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="rounded-2xl border border-zinc-850 bg-zinc-900/20 px-5 py-3 text-sm font-semibold text-zinc-400 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-200"
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
