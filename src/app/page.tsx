import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { HeroSection } from "@/components/home/hero-section";
import { JobsSection } from "@/components/home/jobs-section";
import { UniversitiesSection } from "@/components/home/universities-section";

export const metadata: Metadata = {
  title: "AssamStudentHub | Student Portal for Assam",
  description:
    "Discover Assam government jobs, university notices, scholarships, and student updates in one place.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <Container>
          <HeroSection />
          <JobsSection />
          <UniversitiesSection />
        </Container>

        <Footer />
      </main>
    </>
  );
}
