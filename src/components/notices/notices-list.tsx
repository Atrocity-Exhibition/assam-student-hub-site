import Link from "next/link";
import type { Notice } from "@/types/notice";
import { getNotices } from "@/services/notices";
import { NoticesSearch } from "./notices-search";
import { NoticesSort } from "./notices-sort";
import { getRelativeTime, extractSalary } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Banknote, Search, ChevronLeft, ChevronRight } from "lucide-react";




export function getCategoryStyles(category: string | null) {
  const cat = (category || "").toLowerCase();
  switch (cat) {
    case "recruitment":
      return "border-emerald-550/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "result":
      return "border-blue-550/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "exam":
      return "border-amber-550/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "admission":
      return "border-purple-550/20 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "scholarship":
      return "border-pink-550/20 bg-pink-500/10 text-pink-600 dark:text-pink-400";
    default:
      return "border-border bg-card/40 text-foreground";
  }
}

export function getCategoryHoverClasses(category: string | null) {
  const cat = (category || "").toLowerCase();
  switch (cat) {
    case "recruitment":
      return {
        border: "hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.04)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]",
        text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
        badge: "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      };
    case "result":
      return {
        border: "hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.04)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]",
        text: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
        badge: "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400",
      };
    case "exam":
      return {
        border: "hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.04)] dark:hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]",
        text: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
        badge: "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
      };
    case "admission":
      return {
        border: "hover:border-purple-500/30 dark:hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.04)] dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]",
        text: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
        badge: "border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400",
      };
    case "scholarship":
      return {
        border: "hover:border-pink-500/30 dark:hover:border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.04)] dark:hover:shadow-[0_0_30px_rgba(236,72,153,0.08)]",
        text: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
        badge: "border-pink-500/20 bg-pink-500/5 text-pink-600 dark:text-pink-400",
      };
    default:
      return {
        border: "hover:border-zinc-300 dark:hover:border-zinc-800 hover:shadow-[0_0_30px_rgba(0,0,0,0.02)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.01)]",
        text: "group-hover:text-zinc-900 dark:group-hover:text-zinc-200",
        badge: "border-border bg-card/40 text-foreground",
      };
  }
}

type Props = {
  search?: string;
  category?: string;
  page?: number;
  sort?: string;
  excludeId?: number;
  basePath?: string;
};

const academicCategories = [
  { label: "All Updates", value: "academic" },
  { label: "Results", value: "Result" },
  { label: "Exams", value: "Exam" },
  { label: "Admissions", value: "Admission" },
  { label: "Scholarships", value: "Scholarship" },
  { label: "General Notices", value: "Notice" },
];

export async function NoticesList({
  search,
  category,
  page = 1,
  sort = "newest",
  excludeId,
  basePath = "/jobs",
}: Props) {
  const { notices, totalPages } = await getNotices({
    search,
    category,
    page,
    sort,
    excludeId,
  });

  const getParamsString = (pageNum: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All" && category !== "academic") {
      params.set("category", category);
    }
    if (sort) params.set("sort", sort);
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

  return (
    <section className="mt-10 transition-colors duration-200">
      {/* TOP BAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <NoticesSearch initialSearch={search} currentCategory={category} basePath={basePath} />
        </div>

        <NoticesSort
          currentSort={sort}
          search={search}
          category={category}
          basePath={basePath}
        />
      </div>

      {/* CATEGORY PILLS */}
      {category !== "recruitment" && (
        <div className="mt-5 flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide w-full max-w-full">
          {academicCategories.map((item) => {
            const isActive = item.value === (category || "academic");
            const params = new URLSearchParams();

            if (search) {
              params.set("search", search);
            }

            if (sort) {
              params.set("sort", sort);
            }

            if (item.value !== "academic") {
              params.set("category", item.value);
            }

            return (
              <Link
                key={item.value}
                href={`${basePath}?${params.toString()}`}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "border-brand bg-brand text-primary-foreground shadow shadow-brand/10"
                    : "border-border bg-card/40 text-foreground hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-card"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* EMPTY STATE */}
      {notices.length === 0 && (
        <div className="mt-12 rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-12 text-center shadow-sm max-w-2xl mx-auto">
          <Search className="h-10 w-10 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-200 transition-colors duration-200">No notices found</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
            We couldn&apos;t find any announcements matching your current search or category filter. Try using different keywords, checking the spelling, or clearing filters.
          </p>
          {(search || (category !== "All" && category !== "academic" && category !== "recruitment")) && (
            <Link href={basePath}>
              <Button variant="secondary" size="sm" className="mt-6">
                Clear Filters
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* GRID */}
      {notices.length > 0 && (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {notices.map((notice: Notice) => {
              const hoverClasses = getCategoryHoverClasses(notice.category);
              const formattedDate = getRelativeTime(notice.posted_at || notice.created_at);
              const salary = extractSalary(notice.title, notice.description, notice.metadata);

              return (
                <Link key={notice.id} href={`/jobs/${notice.slug}`}>
                  <article className={`group h-full flex flex-col justify-between rounded-3xl border border-border bg-card/50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-card/75 shadow-sm min-h-[190px] sm:min-h-[210px] ${hoverClasses.border}`}>
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-3.5">
                          <div className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                            {notice.category || "Notice"}
                          </div>
                          
                          {notice.institutions?.name && (
                            <span className="text-xs text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-wider truncate max-w-[200px] transition-colors duration-200">
                              {notice.institutions.name}
                            </span>
                          )}
                        </div>
 
                        <h2 className={`text-base sm:text-lg font-extrabold leading-snug text-zinc-900 dark:text-zinc-200 transition-colors duration-300 line-clamp-2 ${hoverClasses.text}`}>
                          {notice.title}
                        </h2>

                        <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 transition-colors duration-200">
                          {notice.description || "No description provided. Click to view the full announcement details and official attachments."}
                        </p>

                        {salary && (
                          <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 border border-emerald-500/20">
                            <Banknote className="h-3.5 w-3.5 shrink-0" />
                            <span>Salary/Stipend: {salary}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border pt-3.5 text-xs text-zinc-600 dark:text-zinc-300 font-semibold uppercase tracking-wider transition-colors duration-200">
                      <span>{notice.source}</span>
                      <span>{formattedDate}</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2">
              {/* Previous button */}
              {page > 1 ? (
                <Link
                  href={`${basePath}?${getParamsString(page - 1)}`}
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
                    href={`${basePath}?${getParamsString(Number(pageNumber))}`}
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
                  href={`${basePath}?${getParamsString(page + 1)}`}
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
  );
}
