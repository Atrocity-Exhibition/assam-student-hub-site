import type { Metadata } from "next";

import Link from "next/link";

import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

import { getJobBySlug } from "@/services/jobs";
import { createClient } from "@/lib/supabase/server";
import { SaveJobButton } from "@/components/jobs/save-job-button";

type MetadataProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = await params;

  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} | AssamStudentHub`,

    description:
      job.description ||
      "Latest Assam jobs and opportunities.",

    openGraph: {
      title: job.title,

      description:
        job.description ||
        "Latest Assam jobs and opportunities.",

      type: "article",
    },
  };
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function JobPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isSaved = false;

  if (user && job) {
    const { data } =
      await supabase
        .from("saved_jobs")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", job.id)
        .maybeSingle();

    isSaved = !!data;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <Container className="py-14">
          {/* BREADCRUMB */}
          <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
            <Link
              href="/"
              className="hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/jobs"
              className="hover:text-white"
            >
              Jobs
            </Link>

            <span>/</span>

            <span className="text-zinc-300">
              {job.title}
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
            {/* MAIN CONTENT */}
            <div>
              {/* CATEGORY */}
              <div className="mb-6 inline-flex rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400">
                {job.category || "Job"}
              </div>

              {/* TITLE */}
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                {job.title}
              </h1>

              {/* META */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                <span>
                  {job.source}
                </span>

                <span>
                  {job.location}
                </span>

                <span>
                  {new Date(
                    job.created_at,
                  ).toLocaleDateString()}
                </span>
              </div>

              {/* TAGS */}
              {job.tags && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {job.tags.map(
                    (tag: string) => (
                      <div
                        key={tag}
                        className="rounded-full border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-300"
                      >
                        {tag}
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8">
                <h2 className="text-2xl font-bold">
                  Job Description
                </h2>

                <p className="mt-6 leading-8 text-zinc-300">
                  {job.description ||
                    "No description available."}
                </p>
              </div>

              {/* ELIGIBILITY */}
              <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8">
                <h2 className="text-2xl font-bold">
                  Eligibility
                </h2>

                <p className="mt-6 leading-8 text-zinc-300">
                  {job.eligibility ||
                    "Eligibility details not available."}
                </p>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside>
              <div className="sticky top-24 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex gap-4">
                  <a
                    href={job.apply_url || "#"}
                    target="_blank"
                    className="flex-1 rounded-2xl bg-red-500 px-6 py-3 text-center font-medium text-white transition hover:bg-red-400"
                  >
                    Apply Now
                  </a>

                  {user && job && (
                    <SaveJobButton
                      jobId={job.id}
                      isSaved={isSaved}
                    />
                  )}
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <p className="text-sm text-zinc-500">
                      Source
                    </p>

                    <p className="mt-2 text-zinc-200">
                      {job.source}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">
                      Location
                    </p>

                    <p className="mt-2 text-zinc-200">
                      {job.location ||
                        "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">
                      Deadline
                    </p>

                    <p className="mt-2 text-zinc-200">
                      {job.deadline ||
                        "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-zinc-500">
                      Posted
                    </p>

                    <p className="mt-2 text-zinc-200">
                      {new Date(
                        job.created_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}
