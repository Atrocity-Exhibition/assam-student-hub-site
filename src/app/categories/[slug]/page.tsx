import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { getNotices } from "@/services/notices";
import { getCategoryStyles, getCategoryHoverClasses } from "@/components/notices/notices-list";
import { NoticesSearch } from "@/components/notices/notices-search";
import { NoticesSort } from "@/components/notices/notices-sort";
import { Button } from "@/components/ui/button";
import type { Notice } from "@/types/notice";
import { getRelativeTime, extractSalary } from "@/lib/utils";
import { Banknote, ChevronLeft, ChevronRight } from "lucide-react";


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
    alternates: {
      canonical: `https://assamstudenthub.xyz/categories/${slug.toLowerCase()}`,
    },
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

  const getParamsString = (pageNum: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort && sort !== "newest") params.set("sort", sort);
    params.set("page", String(pageNum));
    return params.toString();
  };

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

  const pageNumbers = getPageNumbers(page, totalPages);


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

          {/* FILTER CONTROLS */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <NoticesSearch initialSearch={search} currentCategory={dbCategory} basePath={`/categories/${slug}`} />
            </div>
            <div className="shrink-0">
              <NoticesSort currentSort={sort} search={search} category={dbCategory} basePath={`/categories/${slug}`} />
            </div>
          </div>

          {/* EMPTY STATE */}
          {notices.length === 0 && (
            <div className="mt-12 rounded-3xl border border-border bg-card/30 backdrop-blur-sm p-12 text-center shadow-md max-w-2xl mx-auto">
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
                  
                  return (
                    <Link key={notice.id} href={`/jobs/${notice.slug}`} className="min-w-0">
                      <article className={`group h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border bg-card/50 p-4 sm:p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:bg-card/75 shadow-sm min-h-[190px] sm:min-h-[210px] ${hoverClasses.border}`}>
                        <div className="flex gap-4 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 mb-3.5">
                              <div
                                className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 ${getCategoryStyles(
                                  notice.category
                                )}`}
                              >
                                {notice.category || "Notice"}
                              </div>

                              {notice.institutions?.name && (
                                <span className="hidden sm:inline text-xs text-muted font-medium truncate max-w-[200px]">
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

                        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3.5 flex-wrap gap-3">
                          <span className="text-xs text-muted font-semibold uppercase tracking-wider truncate">
                            {notice.source}
                          </span>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs text-muted font-semibold tracking-wide">
                              {getRelativeTime(notice.posted_at || notice.created_at)}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs font-black ${hoverClasses.text} transition-all duration-300`}>
                              View Notice
                              <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out font-normal">&rarr;</span>
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {/* Previous button */}
                  {page > 1 ? (
                    <Link
                      href={`/categories/${slug}?${getParamsString(page - 1)}`}
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

                    const isActive = pageNumber === page;

                    return (
                      <Link
                        key={pageNumber}
                        href={`/categories/${slug}?${getParamsString(Number(pageNumber))}`}
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
                  {page < totalPages ? (
                    <Link
                      href={`/categories/${slug}?${getParamsString(page + 1)}`}
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
