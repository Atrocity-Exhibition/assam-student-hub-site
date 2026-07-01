import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { Info, HelpCircle, Code2, Database, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | AssamStudentHub",
  description: "Learn about the mission, data architecture, and technology behind AssamStudentHub.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14 sm:py-20 max-w-3xl">
          {/* HEADER */}
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              <Info className="h-3.5 w-3.5 text-brand" />
              Our Mission
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              About AssamStudentHub
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-muted">
              Assam&apos;s unified academic intelligence dashboard. We streamline and simplify how students, job seekers, and scholars access verified announcements from state portals.
            </p>
          </div>

          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted">
            {/* Mission Statement */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-brand" />
                Why We Built This
              </h2>
              <p>
                Navigating academic boards, colleges, and university announcement pages in Assam is often a tedious process. Official notification boards are fragmented across dozens of separate, slower websites. Important notices regarding semester admission deadlines, exam routines, results, and state government recruitment opportunities are easily missed. 
              </p>
              <p>
                AssamStudentHub was created to solve this problem by consolidating public alerts, timetables, and notification documents into a single, lightning-fast dashboard.
              </p>
            </section>

            {/* Ingestion & Scrapers */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-brand" />
                Data Ingestion Infrastructure
              </h2>
              <p>
                We operate automated web crawlers (scrapers) that monitor verified state government announcement boards, university portals (such as Gauhati University, Dibrugarh University, Cotton University), and board domains (such as AHSEC and SEBA) on regular 6-to-24 hour intervals. 
              </p>
              <p>
                Our scrapers safely read public HTML feeds and extract notice titles, original page URLs, and associated official document attachments.
              </p>
            </section>

            {/* AI Enrichment */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Code2 className="h-4.5 w-4.5 text-brand" />
                AI-Powered Information Structuring
              </h2>
              <p>
                To provide genuine value beyond a raw directory of links, our pipelines pass unstructured notification texts and attachment documents through an advanced processing node powered by Google Gemini. This AI engine performs several quality-control checks:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1.5">
                <li>
                  <strong className="text-foreground">Relevance Filtering:</strong> It filters out internal administrative orders, tenders, employee transfers, and other non-student notices.
                </li>
                <li>
                  <strong className="text-foreground">Metadata Extraction:</strong> It extracts structured data such as pay scales, vacancy counts, eligibility requirements, and deadlines.
                </li>
                <li>
                  <strong className="text-foreground">Title Refinement:</strong> It translates messy, all-caps, or generic headlines into clear, readable, and searchable titles.
                </li>
              </ul>
            </section>

            {/* Legal Disclaimer */}
            <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5" />
                Official Status & Disclosures
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                AssamStudentHub is a private, crowdsourced aggregator. We are not owned by, run by, or in any way affiliated with the Government of India, the Government of Assam, or any state university. 
              </p>
              <p className="text-sm leading-relaxed text-muted">
                All original documents, notices, and trademark logos are the copyrights of their respective university boards and department departments. We display information under fair-use guidelines for educational purposes and link back directly to official source websites to guarantee authenticity.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
