import Link from "next/link";

import { getJobs } from "@/services/jobs";

const categories = [
  "All",
  "Government Job",
  "Scholarship",
  "Railway Job",
  "Teaching Job",
  "Internship",
  "IT Job",
];

export async function JobsList() {
  const jobs = await getJobs();

  return (
    <section className="mt-16">
      {/* SEARCH */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-3">
        <input
          type="text"
          placeholder="Search jobs..."
          className="h-14 w-full bg-transparent px-4 text-white outline-none placeholder:text-zinc-500"
        />
      </div>

      {/* CATEGORY PILLS */}
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900/40 px-5 py-2 text-sm text-zinc-300 transition hover:border-red-500/40 hover:bg-zinc-900 hover:text-white"
          >
            {category}
          </button>
        ))}
      </div>

      {/* JOB GRID */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
          >
            <article className="group rounded-3xl border border-zinc-800 bg-zinc-900/30 p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/50">
              {/* CATEGORY */}
              <div className="mb-4 inline-flex rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {job.category || "Job"}
              </div>

              {/* TITLE */}
              <h2 className="text-2xl font-bold leading-tight transition group-hover:text-red-400">
                {job.title}
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-4 line-clamp-3 leading-7 text-zinc-400">
                {job.description ||
                  "No description available."}
              </p>

              {/* TAGS */}
              {job.tags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {job.tags.map(
                    (tag: string) => (
                      <div
                        key={tag}
                        className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400"
                      >
                        {tag}
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* FOOTER */}
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
    </section>
  );
}
