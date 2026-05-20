import Link from "next/link";

import type { Job } from "@/types/job";
import { getJobs } from "@/services/jobs";

import { JobsSearch } from "./jobs-search";
import { JobsSort } from "./jobs-sort";

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
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
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
              className={`shrink-0 rounded-full border px-5 py-2 text-sm transition ${isActive
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-red-500/40 hover:bg-zinc-900 hover:text-white"
                }`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* EMPTY */}
      {jobs.length === 0 && (
        <div className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/30 p-10 text-center">
          <h2 className="text-2xl font-bold">
            No jobs found
          </h2>

          <p className="mt-4 text-zinc-400">
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
                <article className="group h-full rounded-3xl border border-zinc-800 bg-zinc-900/30 p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/50">
                  <div className="mb-4 inline-flex rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                    {job.category ||
                      "Job"}
                  </div>

                  <h2 className="text-2xl font-bold leading-tight transition group-hover:text-red-400">
                    {job.title}
                  </h2>

                  <p className="mt-4 line-clamp-3 leading-7 text-zinc-400">
                    {job.description ||
                      "No description available."}
                  </p>

                  <div className="mt-8 flex items-center justify-between text-sm text-zinc-500">
                    <span>
                      {job.source}
                    </span>

                    <span>
                      {new Date(
                        job.created_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-12 flex justify-center gap-3">
            {Array.from({
              length: totalPages,
            }).map((_, index) => {
              const pageNumber =
                index + 1;

              const isActive =
                pageNumber === page;

              const params =
                new URLSearchParams();

              if (search) {
                params.set(
                  "search",
                  search,
                );
              }

              if (
                category &&
                category !== "All"
              ) {
                params.set(
                  "category",
                  category,
                );
              }

              if (sort) {
                params.set(
                  "sort",
                  sort,
                );
              }

              params.set(
                "page",
                String(pageNumber),
              );

              return (
                <Link
                  key={pageNumber}
                  href={`/jobs?${params.toString()}`}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${isActive
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-red-500/40 hover:bg-zinc-900 hover:text-white"
                    }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
