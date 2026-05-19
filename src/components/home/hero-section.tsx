import { HeroText } from "@/components/shared/hero-text";

const quickLinks = [
  "Government Jobs",
  "Scholarships",
  "Admissions",
  "Exam Routines",
  "Results",
  "Universities",
];

export function HeroSection() {
  return (
    <section className="border-b border-zinc-900">
      <div className="py-20">
        <div className="flex min-h-[58vh] items-center">
          <div className="max-w-4xl">
            {/* TAG */}
            <div className="mb-6 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1 text-sm text-zinc-400">
              Assam jobs, scholarships &
              student updates
            </div>

            {/* HEADING */}
            <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">
              <div>
                Discover
              </div>

              <div className="mt-2">
                <HeroText />
              </div>

              <div className="mt-2">
                Across Assam
              </div>
            </h1>

            {/* SUBTITLE */}
            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
              Search official Assam
              government jobs, university
              notices, scholarships,
              admissions, exam updates,
              and student opportunities in
              one place.
            </p>

            {/* SEARCH */}
            <div className="mt-12 max-w-2xl">
              <div className="relative overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/80 p-1 shadow-[0_0_80px_rgba(239,68,68,0.05)]">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search jobs, scholarships, universities..."
                    className="h-14 w-full bg-transparent px-6 text-base text-white outline-none placeholder:text-zinc-500"
                  />

                  <button className="mr-2 rounded-full bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-400">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="mt-10 flex flex-wrap gap-3">
              {quickLinks.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-300 transition hover:border-red-500/40 hover:bg-zinc-800 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
