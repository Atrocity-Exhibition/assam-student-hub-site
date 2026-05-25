"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/login/actions";

interface MobileMenuProps {
  items: {
    name: string;
    href: string;
  }[];
  user?: User | null;
}

export function MobileMenu({ items, user }: MobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* MOBILE MENU */}
      <Button
        onClick={() => setMobileMenuOpen(true)}
        variant="secondary"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </Button>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-60 bg-black/50 pointer-events-auto opacity-100 visible"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-72 border-l border-border bg-background translate-x-0"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Menu</h2>

              <Button
                onClick={() => setMobileMenuOpen(false)}
                variant="secondary"
                size="icon"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </Button>
            </div>

            {/* NAVIGATION */}
            <nav className="flex flex-col p-3 gap-1">
              {items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-brand bg-brand-bg font-semibold"
                        : "text-zinc-600 hover:bg-card hover:text-brand dark:text-zinc-300 dark:hover:bg-zinc-900/80 dark:hover:text-brand"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="my-2 border-t border-border" />

              {user ? (
                <>
                  <Link
                    href="/saved-jobs"
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      pathname === "/saved-jobs"
                        ? "text-brand bg-brand-bg font-semibold"
                        : "text-zinc-600 hover:bg-card hover:text-brand dark:text-zinc-300 dark:hover:bg-zinc-900/80 dark:hover:text-brand"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Saved Updates
                  </Link>

                  <form action={logout} className="mt-2 px-1">
                    <Button
                      type="submit"
                      variant="secondary"
                      className="w-full justify-center rounded-xl py-2.5 text-sm font-semibold"
                    >
                      Logout
                    </Button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    pathname === "/login"
                      ? "text-brand bg-brand-bg font-semibold"
                      : "text-zinc-600 hover:bg-card hover:text-brand dark:text-zinc-300 dark:hover:bg-zinc-900/80 dark:hover:text-brand"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
