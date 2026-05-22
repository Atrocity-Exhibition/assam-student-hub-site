"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <Button
        onClick={() => setMobileMenuOpen(true)}
        variant="secondary"
        size="sm"
        className="h-9 w-9 p-0 rounded-full md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </Button>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-60 transition duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto bg-black/50 opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-75 border-l border-border bg-background transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Menu</h2>

            <Button
              onClick={() => setMobileMenuOpen(false)}
              variant="secondary"
              size="sm"
              className="h-9 w-9 p-0 rounded-full"
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </Button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col p-3">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-xl px-4 py-3 text-zinc-600 hover:bg-card hover:text-brand dark:text-zinc-300 dark:hover:bg-zinc-900/80 dark:hover:text-brand transition-all duration-200"
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
