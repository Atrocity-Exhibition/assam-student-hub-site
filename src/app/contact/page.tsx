import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { Mail, MessageSquare, AlertTriangle, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | AssamStudentHub",
  description: "Get in touch with the AssamStudentHub team for support, notice corrections, or takedown requests.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14 sm:py-20 max-w-3xl">
          {/* HEADER */}
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              <Mail className="h-3.5 w-3.5 text-brand" />
              Get in Touch
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-muted animate-pulse">
              Have a question, feedback, or need notice corrections? Reach out to the AssamStudentHub support desk.
            </p>
          </div>

          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted">
            {/* Primary Contact Method */}
            <div className="rounded-3xl border border-border bg-card/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-md">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Mail className="h-7 w-7 text-emerald-500" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Email Support
                </h2>
                <p className="text-sm">
                  The most direct way to contact our developer team is via email. We aim to reply to all queries within 24 to 48 hours.
                </p>
                <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                  <a href="mailto:rahulgautam0721@gmail.com" className="hover:underline">
                    rahulgautam0721@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Scenarios */}
            <div className="grid gap-6 sm:grid-cols-2 mt-8">
              {/* Notice Corrections */}
              <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-500" />
                  Notice Corrections
                </h3>
                <p className="text-xs sm:text-sm">
                  Since our platform parses and refines notices using AI pipelines, occasional formatting, date, or text errors can occur. If you spot a discrepancy, email us with the notice link for manual correction.
                </p>
              </div>

              {/* Takedown Requests */}
              <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                  Takedown / DMCA
                </h3>
                <p className="text-xs sm:text-sm">
                  Are you an administrator representing a board or university? If an indexed notice contains sensitive information or needs to be removed, please contact us immediately for prompt removal.
                </p>
              </div>

              {/* Suggest a Scraper */}
              <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4.5 w-4.5 text-emerald-500" />
                  Scraper Requests
                </h3>
                <p className="text-xs sm:text-sm">
                  We are constantly expanding our ingestion nodes. If you would like us to track announcements from another district college, institute, or government board, suggest the portal domain URL.
                </p>
              </div>

              {/* Bugs & Tech Feedback */}
              <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <svg className="h-4.5 w-4.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  Tech Concerns
                </h3>
                <p className="text-xs sm:text-sm">
                  AssamStudentHub is fully open source. If you encounter rendering bugs, responsive design issues, or would like to contribute features, please log an issue on our GitHub repository.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
