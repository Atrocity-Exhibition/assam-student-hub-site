import Link from "next/link";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";

import { Footer } from "@/components/home/footer";

import { getInstitutions } from "@/services/institutions";

export default async function InstitutionsPage() {
  const institutions =
    await getInstitutions();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-border bg-card/50 px-4 py-2 text-sm text-muted font-semibold uppercase tracking-wider">
              Assam Institutions
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight text-foreground">
              Browse Institutions
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted">
              Explore universities, colleges, and educational boards across Assam.
            </p>
          </div>

          {/* GRID */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {institutions.map((institution) => (
              <Link
                key={institution.id}
                href={`/institutions/${institution.slug}`}
              >
                <article className="group rounded-3xl border border-border bg-card/40 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 shadow-sm">
                  <div className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted font-bold uppercase tracking-wider">
                    Institution
                  </div>

                  <h2 className="mt-5 text-2xl font-black text-foreground transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {institution.name}
                  </h2>

                  <p className="mt-4 leading-7 text-muted text-sm line-clamp-3">
                    {institution.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between text-xs text-muted font-semibold uppercase tracking-wider">
                    <span>
                      📍 {institution.location || "Assam, India"}
                    </span>

                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      View Updates &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </Container>

        <Footer />
      </main>
    </>
  );
}
