export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1 text-sm text-zinc-400">
          Assam Student Portal
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          AssamStudentHub
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Aggregated notices, admissions, results, scholarships, and student
          updates from universities and colleges across Assam.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200">
            Explore Notices
          </button>

          <button className="rounded-xl border border-zinc-700 px-5 py-3 font-medium transition hover:bg-zinc-900">
            Universities
          </button>
        </div>
      </section>
    </main>
  );
}