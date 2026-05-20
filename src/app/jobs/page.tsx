import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

import { Footer } from "@/components/home/footer";

import { JobsList } from "@/components/jobs/jobs-list";

export const metadata: Metadata = {
  title:
    "Assam Jobs | AssamStudentHub",

  description:
    "Browse latest Assam government jobs, university vacancies, internships, and recruitment notifications.",
};

type PageProps = {
  searchParams: Promise<{
    search?: string;

    category?: string;

    page?: string;

    sort?: string;
  }>;
};

export default async function JobsPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const search =
    params.search || "";

  const category =
    params.category || "All";

  const page = Number(
    params.page || "1",
  );

  const sort =
    params.sort || "newest";

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400">
              Assam Jobs Portal
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight">
              Browse Latest Jobs
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Discover Assam government
              jobs, university vacancies,
              internships, scholarships,
              and recruitment updates.
            </p>
          </div>

          <JobsList
            search={search}
            category={category}
            page={page}
            sort={sort}
          />
        </Container>

        <Footer />
      </main>
    </>
  );
}
