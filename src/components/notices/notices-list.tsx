import Link from "next/link";
import type { Notice } from "@/types/notice";
import { getNotices } from "@/services/notices";
import { NoticesSearch } from "./notices-search";
import { NoticesSort } from "./notices-sort";

const categories = [
  "All",
  "Recruitment",
  "Result",
  "Exam",
  "Notice",
  "Admission",
  "Scholarship",
];

type Props = {
  search?: string;
  category?: string;
  page?: number;
  sort?: string;
};

export function getCategoryStyles(category: string | null) {
  const cat = (category || "").toLowerCase();
  switch (cat) {
    case "recruitment":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    case "result":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    case "exam":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    case "admission":
      return "border-purple-500/20 bg-purple-500/10 text-purple-400";
    case "scholarship":
      return "border-pink-500/20 bg-pink-500/10 text-pink-400";
    default:
      return "border-zinc-800 bg-zinc-900/50 text-zinc-400";
  }
}

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
    <section className="mt-16">
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
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
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
              className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/10"
                  : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/40 hover:text-zinc-200"
              }`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {notices.length === 0 && (
        <div className="mt-16 rounded-3xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-sm p-12 text-center">
          <h2 className="text-2xl font-bold text-zinc-200">No notices found</h2>
          <p className="mt-4 text-zinc-500 text-sm max-w-md mx-auto">
            We couldn't find any announcements matching your current search or category filter. Try refining your keywords.
          </p>
        </div>
      )}

      {/* GRID */}
      {notices.length > 0 && (
        <>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {notices.map((notice: Notice) => (
              <Link key={notice.id} href={`/notices/${notice.slug}`}>
                <article className="group h-full flex flex-col justify-between rounded-3xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm p-7 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700/80 hover:bg-zinc-900/45 hover:shadow-2xl hover:shadow-black/35">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getCategoryStyles(notice.category)}`}>
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
                      {notice.description || "No description provided. Click to view the full announcement details and official attachments."}
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

                if (category && category !== "All") {
                  params.set("category", category);
                }

                if (sort) {
                  params.set("sort", sort);
                }

                params.set("page", String(pageNumber));

                return (
                  <Link
                    key={pageNumber}
                    href={`/notices?${params.toString()}`}
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
    </section>
  );
}
