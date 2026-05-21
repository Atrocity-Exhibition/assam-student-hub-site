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

      <main className="min-h-screen">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400">
              Assam Institutions
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight">
              Browse Institutions
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Explore universities,
              colleges, and educational
              institutions across Assam.
            </p>
          </div>

          {/* GRID */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {institutions.map(
              (institution) => (
                <Link
                  key={institution.id}
                  href={`/institutions/${institution.slug}`}
                >
                  <article className="group rounded-3xl border border-zinc-800 bg-zinc-900/30 p-7 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-zinc-900/50">
                    <div className="inline-flex rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                      Institution
                    </div>

                    <h2 className="mt-5 text-3xl font-black transition group-hover:text-red-400">
                      {
                        institution.name
                      }
                    </h2>

                    <p className="mt-4 leading-7 text-zinc-400">
                      {institution.description}
                    </p>

                    <div className="mt-8 flex items-center justify-between text-sm text-zinc-500">
                      <span>
                        {
                          institution.location
                        }
                      </span>

                      <span>
                        View →
                      </span>
                    </div>
                  </article>
                </Link>
              ),
            )}
          </div>
        </Container>

        <Footer />
      </main>
    </>
  );
}
