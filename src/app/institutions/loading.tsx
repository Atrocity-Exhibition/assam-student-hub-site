import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

export default function LoadingInstitutionsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl animate-pulse">
            <div className="h-10 w-48 rounded-full bg-muted/20" />

            <div className="mt-6 h-16 w-3/4 rounded-3xl bg-muted/20" />

            <div className="mt-6 h-8 w-2/3 rounded-2xl bg-muted/20" />
          </div>

          {/* GRID */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-border bg-card/30 p-7 animate-pulse"
              >
                <div className="h-6 w-24 rounded-full bg-muted/20" />

                <div className="mt-5 h-10 w-4/5 rounded-2xl bg-muted/20" />

                <div className="mt-4 h-6 w-full rounded-xl bg-muted/20" />
                <div className="mt-2 h-6 w-2/3 rounded-xl bg-muted/20" />

                <div className="mt-8 flex justify-between">
                  <div className="h-5 w-32 rounded-lg bg-muted/20" />
                  <div className="h-5 w-12 rounded-lg bg-muted/20" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
