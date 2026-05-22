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
        className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200 shadow-sm md:hidden"
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
          className={`absolute right-0 top-0 h-full w-75 border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 p-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Menu</h2>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200 shadow-sm"
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
                className="rounded-xl px-4 py-3 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900/80 dark:hover:text-white transition-all duration-200"
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
