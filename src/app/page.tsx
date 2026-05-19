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

      <main>
        <Container>
          <HeroSection />

          <JobsSection />

          <UniversitiesSection />

          <Footer />
        </Container>
      </main>
    </>
  );
}
