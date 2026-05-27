"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden-lock");
    } else {
      document.body.classList.remove("overflow-hidden-lock");
    }
    return () => {
      document.body.classList.remove("overflow-hidden-lock");
    };
  }, [mobileMenuOpen]);

  // Automatically close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* MOBILE MENU TOGGLE BUTTON */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed border border-border bg-card/45 text-foreground hover:bg-card hover:border-zinc-400 dark:hover:border-zinc-700 h-10 w-10 p-0 rounded-full md:hidden touch-manipulation"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* PORTALLED MOBILE DRAWER */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm pointer-events-auto"
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-72 border-l shadow-2xl flex flex-col"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Menu</h2>

                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed border border-border bg-card/45 text-foreground hover:bg-card hover:border-zinc-400 dark:hover:border-zinc-700 h-10 w-10 p-0 rounded-full touch-manipulation"
                      aria-label="Close navigation menu"
                    >
                      <X size={20} />
                    </button>
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
                        >
                          Saved Updates
                        </Link>

                        <form action={logout} className="mt-2 px-1">
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed border border-border bg-card/45 text-foreground hover:bg-card hover:border-zinc-400 dark:hover:border-zinc-700 w-full justify-center rounded-xl py-2.5 text-sm font-semibold touch-manipulation"
                          >
                            Logout
                          </button>
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
                      >
                        Login
                      </Link>
                    )}
                  </nav>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
