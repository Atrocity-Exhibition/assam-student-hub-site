const latestJobs = [
  {
    title:
      "Assam Government recruitment for technical posts",

    description:
      "Official recruitment notification released for multiple technical vacancies across Assam.",

    source: "Govt. of Assam",

    time: "2 hours ago",
  },

  {
    title:
      "Railway apprentice recruitment notification",

    description:
      "Applications open for apprentice and trainee positions under railway recruitment.",

    source: "Railway Recruitment",

    time: "5 hours ago",
  },

  {
    title:
      "Teaching vacancies announced in Assam colleges",

    description:
      "Multiple assistant professor vacancies released for government colleges.",

    source: "Higher Education Assam",

    time: "1 day ago",
  },

  {
    title:
      "Assam Police recruitment notification",

    description:
      "Applications invited for constable and technical vacancies.",

    source: "Assam Police",

    time: "3 days ago",
  },
];

export function JobsSection() {
  return (
    <section className="py-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Latest Jobs
        </h2>

        <p className="mt-2 text-zinc-400">
          Recently aggregated government
          and institutional job updates.
        </p>
      </div>

      <div className="mt-10 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {latestJobs.map((job) => (
          <article
            key={job.title}
            className="group min-w-[340px] rounded-3xl border border-zinc-800 bg-zinc-900/30 p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/50"
          >
            <div className="mb-4 inline-flex rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
              Government Job
            </div>

            <h3 className="text-lg font-semibold leading-7 transition group-hover:text-red-400">
              {job.title}
            </h3>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {job.description}
            </p>

            <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
              <span>{job.time}</span>

              <span>{job.source}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="rounded-full border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm text-zinc-300 transition hover:border-red-500/40 hover:bg-zinc-900 hover:text-white">
          Browse More Jobs
        </button>
      </div>
    </section>
  );
}
