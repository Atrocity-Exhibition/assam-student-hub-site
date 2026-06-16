import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { ShieldCheck, Eye, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | AssamStudentHub",
  description: "Privacy policy and terms of data handling for AssamStudentHub.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14 sm:py-20 max-w-3xl">
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Information Guard
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted">
              Last updated: June 16, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted">
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-brand" />
                1. Information We Collect
              </h2>
              <p>
                We do not track you. AssamStudentHub does not sell or distribute personal identifying credentials. When you register an account, we store only your email address and basic profile attributes managed securely by Supabase Authentication. We collect search queries anonymously for dashboard trending analysis and caching optimization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-brand" />
                2. Data Protection and Caching
              </h2>
              <p>
                All student bookmark data is stored securely in PostgreSQL databases. Scraping processes only access public government academic notice structures, and no personal student credentials are ever passed to exterior endpoints.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-brand" />
                3. Changes to this Policy
              </h2>
              <p>
                We reserve the right to modify this privacy statement at any time. Significant updates will be outlined in the release notes on our Changelog page.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
