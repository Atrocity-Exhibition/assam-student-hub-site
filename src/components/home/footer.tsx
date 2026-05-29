import Link from "next/link";
import { Mail, Bug } from "lucide-react";
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
                <img
                  src="/logo.png"
                  alt="Assam StudentHub Logo"
                  className="h-9 w-9 object-contain rounded-xl shadow-md shadow-emerald-500/10 bg-white group-hover:scale-105 transition-transform duration-300"
                />
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
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-sm flex-1 lg:max-w-3xl lg:ml-auto">
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
                  Exams &amp; Routines
                </Link>
                <Link href="/categories/admissions" className="hover:text-foreground transition-colors">
                  Admissions
                </Link>
                <Link href="/categories/scholarships" className="hover:text-foreground transition-colors">
                  Scholarships
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

            {/* CONTACT */}
            <div>
              <h4 className="mb-4 font-bold text-foreground uppercase tracking-wider text-xs">
                Contact
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:rahulgautam0721@gmail.com"
                  title="Send an email"
                  aria-label="Email"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/40 text-muted transition-all hover:border-zinc-400 hover:bg-card hover:text-foreground dark:hover:border-zinc-700"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/Atrocity-Exhibition"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  aria-label="GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/40 text-muted transition-all hover:border-zinc-400 hover:bg-card hover:text-foreground dark:hover:border-zinc-700"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="mailto:rahulgautam0721@gmail.com?subject=Report%20an%20Issue"
                  title="Report an issue"
                  aria-label="Report an issue"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/40 text-muted transition-all hover:border-critical/40 hover:bg-critical-bg hover:text-critical dark:hover:border-critical/30"
                >
                  <Bug className="h-4 w-4" />
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
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
