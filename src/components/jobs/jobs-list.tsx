import Link from "next/link";

import type { Job } from "@/types/job";
import { getJobs } from "@/services/jobs";

import { JobsSearch } from "./jobs-search";
import { JobsSort } from "./jobs-sort";
import { Button } from "@/components/ui/button";
import { extractSalary, cleanDescription } from "@/lib/utils";
import { Banknote, ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  "All",
  "Government Job",
  "Scholarship",
  "Railway Job",
  "Teaching Job",
  "Internship",
  "IT Job",
];

type Props = {
  search?: string;

  category?: string;

  page?: number;

  sort?: string;
};

export async function JobsList({
  search,
  category,
  page = 1,
  sort = "newest",
}: Props) {
  const {
    jobs,
    totalPages,
  } = await getJobs({
    search,
    category,
    page,
    sort,
  });

  const getParamsString = (pageNum: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);
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
    <section className="mt-16">
      {/* TOP BAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <JobsSearch
            initialSearch={
              search
            }
          />
        </div>

        <JobsSort
          currentSort={sort}
          search={search}
          category={category}
        />
      </div>

      {/* CATEGORY PILLS */}
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full max-w-full">
        {categories.map((item) => {
          const isActive =
            item ===
            (category || "All");

          const params =
            new URLSearchParams();

          if (search) {
            params.set(
              "search",
              search,
            );
          }

          if (sort) {
            params.set(
              "sort",
              sort,
            );
          }

          if (item !== "All") {
            params.set(
              "category",
              item,
            );
          }

          return (
            <Link
              key={item}
              href={`/jobs?${params.toString()}`}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm transition-all duration-300 ${isActive
                  ? "border-brand bg-brand text-primary-foreground shadow shadow-brand/10"
                  : "border-border bg-card/40 text-foreground hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-card"
                }`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* EMPTY */}
      {jobs.length === 0 && (
        <div className="mt-16 rounded-2xl sm:rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-6 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200">
            No jobs found
          </h2>

          <p className="mt-4 text-muted">
            Try different filters.
          </p>
        </div>
      )}

      {/* GRID */}
      {jobs.length > 0 && (
        <>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {jobs.map((job: Job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
              >
                <article className="group h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border bg-card/50 p-4 sm:p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:bg-card/75 shadow-sm min-h-[190px] sm:min-h-[210px] hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.04)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]">
                  <div>
                    <div className="mb-3.5 inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border-emerald-550/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {job.category || "Job"}
                    </div>

                    <h2 className="text-base sm:text-lg font-extrabold leading-snug text-zinc-900 dark:text-zinc-200 transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2">
                      {job.title}
                    </h2>

                    <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 transition-colors duration-200">
                      {cleanDescription(job.description) || "No description available."}
                    </p>

                    {(() => {
                      const salary = extractSalary(job.title, job.description, null);
                      return salary ? (
                        <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 border border-emerald-500/20">
                          <Banknote className="h-3.5 w-3.5 shrink-0" />
                          <span>Salary/Stipend: {salary}</span>
                        </div>
                      ) : null;
                    })()}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-3.5 flex-wrap gap-3 text-xs text-muted font-semibold uppercase tracking-wider transition-colors duration-200">
                    <span>
                      {job.source}
                    </span>

                    <div className="flex items-center gap-4">
                      <span className="tracking-wide">
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-300">
                        View Notice
                        <span className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out font-normal">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-3">
              {/* Previous button */}
              {page > 1 ? (
                <Link
                  href={`/jobs?${getParamsString(page - 1)}`}
                  className="transition-transform active:scale-95 duration-100"
                >
                  <Button
                    variant="secondary"
                    className="h-11 px-4 text-sm font-semibold rounded-2xl flex items-center gap-1.5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  variant="secondary"
                  className="h-11 px-4 text-sm font-semibold rounded-2xl flex items-center gap-1.5 opacity-50 cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Prev</span>
                </Button>
              )}

              {/* Page buttons */}
              {pageNumbers.map((pageNumber, index) => {
                if (pageNumber === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="inline-flex items-center justify-center h-11 w-11 text-zinc-400 dark:text-zinc-500 text-sm font-semibold"
                    >
                      ...
                    </span>
                  );
                }

                const isActive = pageNumber === page;

                return (
                  <Link
                    key={pageNumber}
                    href={`/jobs?${getParamsString(Number(pageNumber))}`}
                    className="relative inline-flex items-center justify-center transition-transform active:scale-95 duration-100 after:absolute after:-inset-2 after:content-['']"
                  >
                    <Button
                      variant={isActive ? "primary" : "secondary"}
                      className="h-11 w-11 p-0 text-sm font-semibold rounded-2xl"
                    >
                      {pageNumber}
                    </Button>
                  </Link>
                );
              })}

              {/* Next button */}
              {page < totalPages ? (
                <Link
                  href={`/jobs?${getParamsString(page + 1)}`}
                  className="transition-transform active:scale-95 duration-100"
                >
                  <Button
                    variant="secondary"
                    className="h-11 px-4 text-sm font-semibold rounded-2xl flex items-center gap-1.5"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  variant="secondary"
                  className="h-11 px-4 text-sm font-semibold rounded-2xl flex items-center gap-1.5 opacity-50 cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
