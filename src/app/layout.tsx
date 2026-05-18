import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AssamStudentHub",
  description:
    "Student portal for Assam universities, colleges, notices, admissions, results, and scholarships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}