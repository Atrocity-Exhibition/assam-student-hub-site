import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { Terminal, ShieldAlert, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "API Documentation | AssamStudentHub",
  description: "Developer API integration instructions for AssamStudentHub services.",
};

export default function ApiDocsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14 sm:py-20 max-w-4xl">
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5 text-brand" />
              Developer Services
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              API Documentation
            </h1>
            <p className="text-lg leading-relaxed text-muted max-w-2xl">
              Integrate verified academic intelligence, notifications, and competitive exam routines directly into your own student-facing applications.
            </p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 border-b border-border pb-3">
                <Terminal className="h-5 w-5 text-emerald-500" />
                Access and Rate Limits
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                The AssamStudentHub public API is currently in private preview. To request a client credential key, please contact the administration. Public endpoints are cached edge-wide and subject to standard rate limits of 100 requests per minute per IP address.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 border-b border-border pb-3">
                <Terminal className="h-5 w-5 text-emerald-500" />
                Endpoints Preview
              </h2>
              <div className="rounded-2xl border border-border bg-card/50 p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 border border-emerald-500/20">GET</span>
                    <code className="text-xs font-mono font-bold text-foreground">/api/v1/notices</code>
                  </div>
                  <p className="text-xs sm:text-sm text-muted">
                    Fetch a paginated feed of verified notices, filterable by category, source, or institution.
                  </p>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 border border-emerald-500/20">GET</span>
                    <code className="text-xs font-mono font-bold text-foreground">/api/v1/institutions</code>
                  </div>
                  <p className="text-xs sm:text-sm text-muted">
                    Retrieve active metrics and update schedules for all mapped colleges and university boards.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-critical-border bg-critical/5 p-6 flex gap-4 items-start">
              <ShieldAlert className="h-6 w-6 text-critical shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">Notice on Usage</h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Bulk scraping or mirroring this API is strictly prohibited. All requests must carry a valid user agent representing the consuming service.
                </p>
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
