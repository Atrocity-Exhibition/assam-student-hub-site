import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

export default function LoadingInstitutionDetailPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 animate-pulse">
        <Container className="py-14">
          {/* HERO */}
          <div className="max-w-4xl">
            <div className="h-6 w-32 rounded-full bg-muted/20" />

            <div className="mt-6 h-16 w-3/4 rounded-3xl bg-muted/20" />

            <div className="mt-6 h-20 w-full rounded-2xl bg-muted/20" />

            <div className="mt-8 flex gap-4">
              <div className="h-12 w-48 rounded-2xl bg-muted/20" />
              <div className="h-12 w-40 rounded-2xl bg-muted/20" />
            </div>
          </div>

          {/* ACTIVE UPDATES FEED */}
          <section className="mt-20">
            <div className="h-10 w-64 rounded-xl bg-muted/20" />
            <div className="mt-2 h-5 w-96 rounded-lg bg-muted/20" />

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-border bg-card/30 p-7"
                >
                  <div className="h-6 w-20 rounded-full bg-muted/20" />

                  <div className="mt-5 h-8 w-4/5 rounded-xl bg-muted/20" />

                  <div className="mt-4 h-6 w-full rounded-lg bg-muted/20" />
                  <div className="mt-2 h-6 w-3/4 rounded-lg bg-muted/20" />

                  <div className="mt-6 flex justify-between">
                    <div className="h-5 w-24 rounded bg-muted/20" />
                    <div className="h-5 w-20 rounded bg-muted/20" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}
