import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/20 py-12 transition-colors duration-200">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          {/* BRAND & STATUS */}
          <div className="max-w-sm space-y-6">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-black tracking-tight text-foreground">
                Assam<span className="text-emerald-600 dark:text-emerald-400">Student</span>Hub
              </Link>
            </div>

            <p className="text-sm leading-relaxed text-muted">
              Assam&apos;s unified academic intelligence dashboard. Aggregating announcements, recruitments, exam routines, results, and admissions from across verified state portals.
            </p>

            {/* Pulse Status Indicator */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All scrapers operational</span>
            </div>
          </div>

          {/* METRICS & LINKS GRID */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-sm flex-1 lg:max-w-2xl">
            {/* PLATFORM LINKS */}
            <div>
              <h4 className="mb-4 font-bold text-foreground uppercase tracking-wider text-xs">
                Categories
              </h4>
              <div className="flex flex-col gap-2.5 text-muted">
                <Link href="/categories/recruitment" className="hover:text-foreground transition-colors">
                  Recruitment
                </Link>
                <Link href="/categories/results" className="hover:text-foreground transition-colors">
                  Results
                </Link>
                <Link href="/categories/exams" className="hover:text-foreground transition-colors">
                  Exams & Routines
                </Link>
                <Link href="/categories/admissions" className="hover:text-foreground transition-colors">
                  Admissions
                </Link>
              </div>
            </div>

            {/* RESOURCES */}
            <div>
              <h4 className="mb-4 font-bold text-foreground uppercase tracking-wider text-xs">
                System Nodes
              </h4>
              <div className="flex flex-col gap-2.5 text-muted">
                <Link href="/institutions" className="hover:text-foreground transition-colors">
                  All Institutions
                </Link>
                <Link href="/monitoring" className="hover:text-foreground transition-colors">
                  Scraper Health
                </Link>
                <a href="#" className="hover:text-foreground transition-colors">
                  API Docs
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Changelog
                </a>
              </div>
            </div>

            {/* SYSTEM STATS */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-4 font-bold text-foreground uppercase tracking-wider text-xs">
                Infrastructure
              </h4>
              <div className="space-y-3 font-mono text-xs text-muted">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span>Ingest Pipelines</span>
                  <span className="text-foreground font-semibold">9 Active</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span>Update Interval</span>
                  <span className="text-foreground font-semibold">6 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Integrity Guard</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            © {new Date().getFullYear()} AssamStudentHub. Sourced from official websites.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
