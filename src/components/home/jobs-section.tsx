import Link from "next/link";

import { getJobs } from "@/services/jobs";

export async function JobsSection() {
  const { jobs } = await getJobs();

  return (
    <section className="py-16">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Latest Jobs
        </h2>

        <p className="mt-2 text-zinc-400">
          Recently aggregated government
          and institutional job updates.
        </p>
      </div>

      {/* JOBS */}
      <div className="mt-10 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
          >
            <article className="group min-w-[340px] rounded-3xl border border-zinc-800 bg-zinc-900/30 p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/50">
              {/* CATEGORY */}
              <div className="mb-4 inline-flex rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {job.category || "Job"}
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold leading-7 transition group-hover:text-red-400">
                {job.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                {job.description ||
                  "No description available."}
              </p>

              {/* FOOTER */}
              <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
                <span>{job.source}</span>

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

      {/* BUTTON */}
      <div className="mt-8 flex justify-center">
        <button className="rounded-full border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm text-zinc-300 transition hover:border-red-500/40 hover:bg-zinc-900 hover:text-white">
          Browse More Jobs
        </button>
      </div>
    </section>
  );
}
