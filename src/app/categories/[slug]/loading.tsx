import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

export default function LoadingCategoryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Container className="py-14 animate-pulse">
          {/* HEADER */}
          <div className="max-w-3xl mb-12">
            <div className="h-6 w-44 rounded-full bg-muted/20" />
            <div className="mt-6 h-14 w-3/4 rounded-3xl bg-muted/20" />
            <div className="mt-6 h-12 w-full rounded-2xl bg-muted/20" />
          </div>

          {/* TWO COLUMN GRID */}
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* LEFT COLUMN: Notices List */}
            <div>
              {/* FILTER CONTROLS */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="h-12 flex-1 rounded-2xl bg-muted/15" />
                <div className="h-12 w-40 rounded-2xl bg-muted/15" />
              </div>

              {/* GRID OF CARDS */}
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-border bg-card/30 p-7"
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="h-6 w-20 rounded-full bg-muted/20" />
                      <div className="h-5 w-24 rounded bg-muted/20" />
                    </div>

                    <div className="h-8 w-4/5 rounded-xl bg-muted/20" />
                    <div className="mt-4 h-6 w-full rounded-lg bg-muted/20" />
                    <div className="mt-2 h-6 w-3/4 rounded-lg bg-muted/20" />

                    <div className="mt-8 flex justify-between">
                      <div className="h-5 w-20 rounded bg-muted/20" />
                      <div className="h-5 w-16 rounded bg-muted/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar Widgets */}
            <aside className="space-y-8">
              {/* Trending Institutions Widget */}
              <div className="rounded-3xl border border-border bg-card/40 p-6 space-y-4">
                <div className="h-7 w-44 rounded-lg bg-muted/20" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="h-5 w-36 rounded bg-muted/20" />
                      <div className="h-5 w-8 rounded-full bg-muted/20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Updates Widget */}
              <div className="rounded-3xl border border-border bg-card/40 p-6 space-y-4">
                <div className="h-7 w-32 rounded-lg bg-muted/20" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="h-5 w-full rounded bg-muted/20" />
                      <div className="h-4 w-20 rounded bg-muted/20" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}
