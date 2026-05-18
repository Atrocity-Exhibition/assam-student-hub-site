import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

import { HeroText } from "@/components/shared/hero-text";

const quickLinks = [
  "Government Jobs",
  "Scholarships",
  "Admissions",
  "Exam Routines",
  "Results",
  "Universities",
];

const latestJobs = [
  {
    title: "Assam Government recruitment for technical posts",
    description:
      "Official recruitment notification released for multiple technical vacancies across Assam.",
    source: "Govt. of Assam",
    time: "2 hours ago",
  },

  {
    title: "Railway apprentice recruitment notification",
    description:
      "Applications open for apprentice and trainee positions under railway recruitment.",
    source: "Railway Recruitment",
    time: "5 hours ago",
  },

  {
    title: "Teaching vacancies announced in Assam colleges",
    description:
      "Multiple assistant professor vacancies released for government colleges.",
    source: "Higher Education Assam",
    time: "1 day ago",
  },
];

const universities = [
  "Assam University",
  "Gauhati University",
  "Dibrugarh University",
  "Cotton University",
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="border-b border-zinc-900">
          <Container className="py-20">
            <div className="flex min-h-[58vh] items-center">
              <div className="max-w-4xl">
                {/* TAG */}
                <div className="mb-6 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1 text-sm text-zinc-400">
                  Assam jobs, scholarships & student updates
                </div>

                {/* HEADING */}
                <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl">
                  <div>Discover</div>

                  <div className="mt-2">
                    <HeroText />
                  </div>

                  <div className="mt-2">Across Assam</div>
                </h1>

                {/* SUBTITLE */}
                <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
                  Search official Assam government jobs, university notices,
                  scholarships, admissions, exam updates, and student
                  opportunities in one place.
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
          </Container>
        </section>

        {/* LATEST JOBS */}
        <section className="py-16">
          <Container>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Latest Jobs</h2>

              <p className="mt-2 text-zinc-400">
                Recently aggregated government and institutional job updates.
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
          </Container>
        </section>

        {/* UNIVERSITIES */}
        <section className="border-t border-zinc-900 py-16">
          <Container>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Browse Universities
              </h2>

              <p className="mt-2 text-zinc-400">
                Explore institutions and their latest notices.
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
                    Notices, admissions, exam updates, and more.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button className="rounded-full border border-zinc-800 bg-zinc-900/50 px-6 py-3 text-sm text-zinc-300 transition hover:border-red-500/40 hover:bg-zinc-900 hover:text-white">
                Browse More Universities
              </button>
            </div>
          </Container>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-900 py-12">
          <Container>
            <div className="flex flex-col gap-10 md:flex-row md:justify-between">
              {/* BRAND */}
              <div className="max-w-sm">
                <h3 className="text-xl font-black">
                  <span className="text-white">AssamStudent</span>

                  <span className="text-red-500">Hub</span>
                </h3>

                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Aggregating Assam jobs, scholarships, university notices,
                  admissions, and exam updates in one place.
                </p>
              </div>

              {/* LINKS */}
              <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
                <div>
                  <h4 className="mb-3 font-semibold text-white">Platform</h4>

                  <div className="flex flex-col gap-2 text-zinc-400">
                    <a href="#">Jobs</a>

                    <a href="#">Scholarships</a>

                    <a href="#">Universities</a>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold text-white">Resources</h4>

                  <div className="flex flex-col gap-2 text-zinc-400">
                    <a href="#">About</a>

                    <a href="#">Contact</a>

                    <a href="#">Privacy</a>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold text-white">Connect</h4>

                  <div className="flex flex-col gap-2 text-zinc-400">
                    <a href="#">GitHub</a>

                    <a href="#">Twitter</a>

                    <a href="#">Email</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-zinc-900 pt-6 text-sm text-zinc-500">
              © 2026 AssamStudentHub. All rights reserved.
            </div>
          </Container>
        </footer>
      </main>
    </>
  );
}
