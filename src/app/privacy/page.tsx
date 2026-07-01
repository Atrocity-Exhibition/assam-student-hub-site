import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { ShieldCheck, Eye, Lock, Cookie, UserCheck, Link2, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | AssamStudentHub",
  description: "Privacy policy and AdSense cookies compliance disclosures for AssamStudentHub.",
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
              Privacy Compliance
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted">
              Last updated: July 1, 2026
            </p>
          </div>

          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted">
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-brand" />
                1. Information We Collect
              </h2>
              <p>
                We do not track your personal activities across other websites. AssamStudentHub does not sell or distribute personal identifying credentials. When you register an account, we store only your email address and basic profile attributes managed securely by Supabase Authentication. We collect search queries anonymously for dashboard trending analysis and caching optimization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Cookie className="h-4.5 w-4.5 text-brand" />
                2. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies to improve your browsing experience, save preferences (such as saved searches and bookmarks), and analyze traffic patterns. Additionally, third-party services like Google AdSense use cookies to serve advertisements based on your visits to this website and other sites across the internet.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <UserCheck className="h-4.5 w-4.5 text-brand" />
                3. Google AdSense & Personalized Advertising
              </h2>
              <div className="space-y-2">
                <p>
                  Google, as a third-party vendor, uses cookies to serve ads on AssamStudentHub. Google’s use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.
                </p>
                <p>
                  Users may opt out of personalized advertising by visiting the{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:text-emerald-400 font-semibold underline transition-colors"
                  >
                    Google Ads Settings
                  </a>
                  . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:text-emerald-400 font-semibold underline transition-colors"
                  >
                    AboutAds.info
                  </a>
                  .
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-brand" />
                4. Data Protection and Security
              </h2>
              <p>
                All student bookmark and preference data is stored securely in PostgreSQL databases managed by Supabase. Access is restricted through Row-Level Security (RLS) policies. Scraping processes only access public government academic notice structures, and no personal student credentials are ever passed to exterior endpoints.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Link2 className="h-4.5 w-4.5 text-brand" />
                5. Third-party Links & Portals
              </h2>
              <p>
                AssamStudentHub aggregates public updates and links directly to official government boards, college, and university domains. We have no control over the privacy policies, cookies, or data practices of these external websites. Once you leave our domain via a source link or attachment URL, we recommend reviewing the privacy policy of the destination website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-brand" />
                6. Contact Information
              </h2>
              <p>
                If you have questions, comments, or compliance concerns regarding this privacy policy, please contact us at{" "}
                <a
                  href="mailto:rahulgautam0721@gmail.com"
                  className="text-emerald-500 hover:text-emerald-400 font-semibold underline transition-colors"
                >
                  rahulgautam0721@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
