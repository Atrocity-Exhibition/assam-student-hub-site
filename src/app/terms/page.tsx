import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { Scale, Info, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | AssamStudentHub",
  description: "Terms and conditions of using AssamStudentHub platforms.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-500">
        <Container className="py-14 sm:py-20 max-w-3xl">
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
              <Scale className="h-3.5 w-3.5 text-brand" />
              Legal Framework
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-muted">
              Last updated: May 23, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted">
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-brand" />
                1. Acceptance of Terms
              </h2>
              <p>
                By using AssamStudentHub, you accept these terms in full. If you do not agree to these terms or any part thereof, you must not use our public services or API interfaces.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-brand" />
                2. Information Disclaimer
              </h2>
              <p>
                AssamStudentHub aggregates public information from various university websites and official boards. While we strive to maintain accuracy and verifiability through structured parsers, we do not guarantee the completeness or validity of any data. Students are always advised to cross-reference with official university portals for final confirmations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Scale className="h-4.5 w-4.5 text-brand" />
                3. Acceptable Use
              </h2>
              <p>
                You must not use this website in any way that causes, or may cause, damage to the platform or impairment of the availability or accessibility of our services. Scraping, indexing, or bulk fetching database dumps without prior consent is strictly prohibited.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
