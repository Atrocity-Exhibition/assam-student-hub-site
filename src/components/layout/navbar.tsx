"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Container } from "./container";

const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Jobs",
    href: "/jobs",
  },
  {
    name: "Institutions",
    href: "/institutions",
  },
  {
    name: "Exams",
    href: "/exams",
  },
  {
    name: "Scholarships",
    href: "/scholarships",
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/75 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="shrink-0 text-2xl font-black tracking-tight"
          >
            <span className="text-green-500">Assam</span>

            <span className="text-white">Student</span>

            <span className="text-red-500">Hub</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white">
              Login
            </button>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition hover:bg-zinc-900 md:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </Container>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-60 transition duration-300 ${mobileMenuOpen
          ? "pointer-events-auto bg-black/50 opacity-100"
          : "pointer-events-none opacity-0"
          }`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-75 border-l border-zinc-800 bg-black transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-zinc-800 p-4">
            <h2 className="text-lg font-semibold">Menu</h2>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition hover:bg-zinc-900"
            >
              <X size={18} />
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col p-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
