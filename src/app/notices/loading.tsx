import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

export default function LoadingJobsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl animate-pulse">
            <div className="h-10 w-40 rounded-full bg-zinc-900" />

            <div className="mt-6 h-16 w-full rounded-3xl bg-zinc-900" />

            <div className="mt-6 h-8 w-3/4 rounded-2xl bg-zinc-900" />
          </div>

          {/* SEARCH */}
          <div className="mt-16 h-20 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/40" />

          {/* FILTERS */}
          <div className="mt-6 flex gap-3">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-28 animate-pulse rounded-full bg-zinc-900"
              />
            ))}
          </div>

          {/* GRID */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-7"
              >
                <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-900" />

                <div className="mt-6 h-10 w-4/5 animate-pulse rounded-2xl bg-zinc-900" />

                <div className="mt-4 h-6 w-full animate-pulse rounded-xl bg-zinc-900" />

                <div className="mt-2 h-6 w-3/4 animate-pulse rounded-xl bg-zinc-900" />

                <div className="mt-8 flex justify-between">
                  <div className="h-5 w-24 animate-pulse rounded-lg bg-zinc-900" />

                  <div className="h-5 w-20 animate-pulse rounded-lg bg-zinc-900" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
