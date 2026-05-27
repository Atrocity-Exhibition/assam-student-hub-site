import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { NoticesList } from "@/components/notices/notices-list";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Browse All Notices | AssamStudentHub",
  description:
    "Browse all government job recruitments, competitive exams, results, scholarships, university admissions, and official notices from Assam in one place.",
  alternates: {
    canonical: "https://assamstudenthub.xyz/browse",
  },
};

type PageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
};

const CATEGORIES = [
  { name: "All", href: "/browse" },
  { name: "Jobs", href: "/jobs" },
  { name: "Exams", href: "/categories/exams" },
  { name: "Scholarships", href: "/categories/scholarships" },
  { name: "Results", href: "/categories/results" },
  { name: "Admissions", href: "/categories/admissions" },
  { name: "Notices", href: "/categories/notices" },
];

export default async function BrowsePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const page = Number(params.page || "1");
  const sort = params.sort || "newest";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-border bg-card/40 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              All Categories
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Browse All Notices
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted max-w-2xl">
              Every recruitment, exam notification, scholarship, result, admission circular, and
              official announcement from across Assam — all in one place.
            </p>
          </div>

          {/* CATEGORY QUICK LINKS */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  cat.name === "All"
                    ? "border-brand bg-brand-bg text-brand-text"
                    : "border-border bg-card/40 text-muted hover:border-foreground/30 hover:text-foreground hover:bg-card"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <NoticesList
            search={search}
            category="All"
            page={page}
            sort={sort}
            basePath="/browse"
          />
        </Container>

        <Footer />
      </main>
    </>
  );
}
