const universities = [
  "Assam University",
  "Gauhati University",
  "Dibrugarh University",
  "Cotton University",
  "Tezpur University",
];

export function UniversitiesSection() {
  return (
    <section className="border-t border-zinc-900 py-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Browse Universities
        </h2>

        <p className="mt-2 text-zinc-400">
          Explore institutions and their
          latest notices.
        </p>
      </div>

      <div className="mt-10 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {universities.map((university) => (
          <div
            key={university}
            className="group min-w-[280px] rounded-3xl border border-zinc-800 bg-zinc-900/30 p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/50"
          >
            <h3 className="font-semibold transition group-hover:text-red-400">
              {university}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Notices, admissions, exam
              updates, and more.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="rounded-full border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm text-zinc-300 transition hover:border-red-500/40 hover:bg-zinc-900 hover:text-white">
          Browse More Universities
        </button>
      </div>
    </section>
  );
}
