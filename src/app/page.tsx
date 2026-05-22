import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/home/footer";
import { HeroSection } from "@/components/home/hero-section";
import { NoticesSection } from "@/components/home/notices-section";
import { UniversitiesSection } from "@/components/home/universities-section";

export const metadata: Metadata = {
  title: "AssamStudentHub | Student Portal for Assam",
  description:
    "Discover Assam government updates, university notices, scholarships, and student announcements in one place.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Container>
          <HeroSection />
          <NoticesSection />
          <UniversitiesSection />
        </Container>

        <Footer />
      </main>
    </>
  );
}
