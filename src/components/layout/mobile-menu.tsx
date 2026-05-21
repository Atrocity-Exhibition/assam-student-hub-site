"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  items: {
    name: string;
    href: string;
  }[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* MOBILE MENU */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition hover:bg-zinc-900 md:hidden"
      >
        <Menu size={18} />
      </button>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-60 transition duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto bg-black/50 opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-75 border-l border-zinc-800 bg-black transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
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
            {items.map((item) => (
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
