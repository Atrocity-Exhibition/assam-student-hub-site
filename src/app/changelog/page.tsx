import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { Calendar, Milestone } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog | AssamStudentHub",
  description: "Recent updates, features, and engine improvements for AssamStudentHub.",
};

export default function ChangelogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14 sm:py-20 max-w-3xl">
          <div className="space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              <Milestone className="h-3.5 w-3.5 text-brand" />
              Platform History
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Changelog
            </h1>
            <p className="text-lg leading-relaxed text-muted">
              Keep track of updates, performance enhancements, scraper improvements, and new features added to the platform.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l border-border ml-3 space-y-12">
            
            {/* Version 1.3.0 */}
            <div className="relative pl-8">
              {/* Circle indicator */}
              <div className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full border-2 border-brand bg-background" />
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-foreground">v1.3.0</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Calendar className="h-3 w-3" />
                    June 2026
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">SEO Redirection & Mobile Layout Polishing</h3>
                <ul className="list-disc pl-5 text-sm text-muted space-y-2 leading-relaxed">
                  <li>Enforced permanent (308) redirection from the <code>www</code> subdomain to the canonical root domain, resolving sitemap indexing and search engine crawler validation errors in Google Search Console.</li>
                  <li>Refactored exams, institutions, and categories card components to prevent notice metadata and &quot;View Notice&quot; triggers from overflowing or being cut off on mobile breakpoints.</li>
                  <li>Cleaned up spacing and layout for home page quick-links/pills, resolving clutter on smaller viewports.</li>
                </ul>
              </div>
            </div>

            {/* Version 1.2.0 */}
            <div className="relative pl-8">
              {/* Circle indicator */}
              <div className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full border-2 border-border bg-background" />
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-foreground">v1.2.0</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Calendar className="h-3 w-3" />
                    May 2026
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Competitive Exams Separation & Salary Parsing</h3>
                <ul className="list-disc pl-5 text-sm text-muted space-y-2 leading-relaxed">
                  <li>Excluded academic university notices from global competitive exam / results lists.</li>
                  <li>Added intelligent, regular-expression-based salary and stipend parsing from notice titles and descriptions.</li>
                  <li>Optimized theme toggle layout and fixed Lucide icon alignment bugs in dark mode.</li>
                  <li>Introduced radial-gradient dot background patterns on body layouts for a modern aesthetic.</li>
                </ul>
              </div>
            </div>

            {/* Version 1.1.0 */}
            <div className="relative pl-8">
              {/* Circle indicator */}
              <div className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full border-2 border-border bg-background" />
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-foreground">v1.1.0</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Calendar className="h-3 w-3" />
                    April 2026
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Unified Scraper Monitoring Dashboard</h3>
                <ul className="list-disc pl-5 text-sm text-muted space-y-2 leading-relaxed">
                  <li>Launched active telemetry dashboard at `/monitoring` to track health statuses of academic crawlers.</li>
                  <li>Integrated full text search indexing (FTS) using PostgreSQL trigrams with typographic error tolerance.</li>
                  <li>Added bookmarking support allowing students to save key notices for offline reference.</li>
                </ul>
              </div>
            </div>

            {/* Version 1.0.0 */}
            <div className="relative pl-8">
              {/* Circle indicator */}
              <div className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full border-2 border-border bg-background" />
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-foreground">v1.0.0</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Calendar className="h-3 w-3" />
                    March 2026
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Initial Launch</h3>
                <ul className="list-disc pl-5 text-sm text-muted space-y-2 leading-relaxed">
                  <li>Deployed core architecture tracking 6 major state institution boards in Assam.</li>
                  <li>Built semantic dark mode theme matching editorial design tokens.</li>
                </ul>
              </div>
            </div>

          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
