import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

import { Footer } from "@/components/home/footer";
import { HeroSection } from "@/components/home/hero-section";
import { JobsSection } from "@/components/home/jobs-section";
import { UniversitiesSection } from "@/components/home/universities-section";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <Container>
          {/* HERO */}
          <HeroSection />

          {/* JOBS */}
          <JobsSection />

          {/* UNIVERSITIES */}
          <UniversitiesSection />

          {/* FOOTER */}
          <Footer />
        </Container>
      </main>
    </>
  );
}
