import Link from "next/link";
import type { Notice } from "@/types/notice";
import { getNotices } from "@/services/notices";
import { NoticesSearch } from "./notices-search";
import { NoticesSort } from "./notices-sort";
import { getRelativeTime, extractSalary } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Banknote, Search } from "lucide-react";

const categories = [
  "All",
  "Recruitment",
  "Result",
  "Exam",
  "Notice",
  "Admission",
  "Scholarship",
];

const categoryAccentColors: Record<string, string> = {
  recruitment: "bg-emerald-500",
  result: "bg-blue-500",
  exam: "bg-amber-500",
  admission: "bg-purple-500",
  scholarship: "bg-pink-500",
  notice: "bg-zinc-500",
};

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
};

export async function NoticesList({
  search,
  category,
  page = 1,
  sort = "newest",
}: Props) {
  const { notices, totalPages } = await getNotices({
    search,
    category,
    page,
    sort,
  });

  return (
    <section className="mt-10 transition-colors duration-200">
      {/* TOP BAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <NoticesSearch initialSearch={search} />
        </div>

        <NoticesSort
          currentSort={sort}
          search={search}
          category={category}
        />
      </div>

      {/* CATEGORY PILLS */}
      <div className="mt-5 flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((item) => {
          const isActive = item === (category || "All");
          const params = new URLSearchParams();

          if (search) {
            params.set("search", search);
          }

          if (sort) {
            params.set("sort", sort);
          }

          if (item !== "All") {
            params.set("category", item);
          }

          return (
            <Link
              key={item}
              href={`/notices?${params.toString()}`}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all duration-300 ${
                isActive
                  ? "border-brand bg-brand text-primary-foreground shadow shadow-brand/10"
                  : "border-border bg-card/40 text-foreground hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-card"
              }`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {notices.length === 0 && (
        <div className="mt-12 rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-12 text-center shadow-sm max-w-2xl mx-auto">
          <Search className="h-10 w-10 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-200 transition-colors duration-200">No notices found</h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            We couldn&apos;t find any announcements matching your current search or category filter. Try using different keywords, checking the spelling, or clearing filters.
          </p>
          {(search || category !== "All") && (
            <Link href="/notices">
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
              const accentColor = categoryAccentColors[(notice.category || "").toLowerCase()] || "bg-zinc-500";
              const salary = extractSalary(notice.title, notice.description, notice.metadata);

              return (
                <Link key={notice.id} href={`/notices/${notice.slug}`}>
                  <article className={`group h-full flex flex-col justify-between rounded-3xl border border-border bg-card/50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-card/75 shadow-sm ${hoverClasses.border}`}>
                    <div className="flex gap-4">
                      {/* Left accent strip */}
                      <div className={`w-1 shrink-0 rounded-full ${accentColor} opacity-90 group-hover:scale-y-[1.03] transition-transform duration-300`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-3.5">
                          <div className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
                            {notice.category || "Notice"}
                          </div>
                          
                          {notice.institutions?.name && (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider truncate max-w-[200px] transition-colors duration-200">
                              {notice.institutions.name}
                            </span>
                          )}
                        </div>
 
                        <h2 className={`text-base sm:text-lg font-extrabold leading-snug text-zinc-900 dark:text-zinc-200 transition-colors duration-300 line-clamp-2 ${hoverClasses.text}`}>
                          {notice.title}
                        </h2>

                        <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 transition-colors duration-200">
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

                    <div className="mt-6 flex items-center justify-between border-t border-border pt-3.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider transition-colors duration-200">
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
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === page;
                const params = new URLSearchParams();

                if (search) {
                  params.set("search", search);
                }

                if (category && category !== "All") {
                  params.set("category", category);
                }

                if (sort) {
                  params.set("sort", sort);
                }

                params.set("page", String(pageNumber));

                return (
                  <Link key={pageNumber} href={`/notices?${params.toString()}`}>
                    <Button
                      variant={isActive ? "primary" : "secondary"}
                      className="h-9 w-9 p-0 text-xs font-bold rounded-xl"
                    >
                      {pageNumber}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
