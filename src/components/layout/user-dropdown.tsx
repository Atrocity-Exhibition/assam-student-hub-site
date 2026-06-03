"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Bookmark } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/login/actions";

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard accessibility
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const email = user.email || "";
  const name = user.user_metadata?.full_name || user.user_metadata?.name || "";
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
  const initial = (name ? name[0] : email ? email[0] : "U").toUpperCase();

  return (
    <div ref={containerRef} className="relative z-50">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center justify-center rounded-full transition-transform active:scale-95 hover:scale-105 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile picture"
            width="32"
            height="32"
            fetchPriority="low"
            loading="eager"
            className="h-8 w-8 rounded-full border border-border bg-white object-cover shadow-sm"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-xs font-bold text-white uppercase border border-emerald-500/20 shadow-sm">
            {initial}
          </div>
        )}
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card/95 backdrop-blur-lg p-2.5 shadow-xl outline-none"
          >
            {/* Header: User Info */}
            <div className="px-3 py-2 flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile picture"
                  width="40"
                  height="40"
                  loading="lazy"
                  className="h-10 w-10 rounded-full border border-border bg-white object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-sm font-bold text-white uppercase border border-emerald-500/20">
                  {initial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {name && (
                  <p className="text-sm font-bold text-foreground truncate leading-tight">
                    {name}
                  </p>
                )}
                <p className="text-xs text-muted truncate mt-0.5 leading-tight">
                  {email}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-1.5 border-t border-border" />

            {/* Links & Actions */}
            <div className="space-y-0.5">
              <Link
                href="/saved-jobs"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800/80 transition-colors"
              >
                <Bookmark className="h-4 w-4 text-muted" />
                <span>Saved Updates</span>
              </Link>

              {/* Divider */}
              <div className="my-1.5 border-t border-border" />

              <form action={logout} onSubmit={() => setIsOpen(false)}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-critical hover:bg-critical-bg hover:text-critical font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
