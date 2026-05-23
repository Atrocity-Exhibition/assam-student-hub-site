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
              <Link
                href="/"
                className="group shrink-0 flex items-center gap-2.5 text-2xl font-black tracking-tight"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-lg font-black text-white">A</span>
                </div>
                <div className="leading-none text-left">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 font-black tracking-wide text-[10px] uppercase block font-semibold">Assam</span>
                  <span className="text-zinc-900 dark:text-white font-bold text-base block -mt-0.5 transition-colors duration-200">StudentHub</span>
                </div>
              </Link>
            </div>

            <p className="text-sm leading-relaxed text-muted">
              Assam&apos;s unified academic intelligence dashboard. Sourcing and aggregating announcements, recruitments, exam routines, results, and admissions from across verified state portals.
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
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-sm flex-1 lg:max-w-2xl lg:ml-auto">
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
                <Link href="/api-docs" className="hover:text-foreground transition-colors">
                  API Docs
                </Link>
                <Link href="/changelog" className="hover:text-foreground transition-colors">
                  Changelog
                </Link>
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
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
