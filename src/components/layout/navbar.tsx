import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { logout } from "@/app/login/actions";

import { Button } from "@/components/ui/button";
import { Container } from "./container";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

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
    href: "/categories/exams",
  },
  {
    name: "Scholarships",
    href: "/categories/scholarships",
  },
  {
    name: "All Notices",
    href: "/browse",
  },
];


export async function Navbar() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 dark:border-zinc-800/80 dark:bg-black/75 backdrop-blur-xl transition-colors duration-200">
        <Container className="flex h-16 items-center justify-between gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="group shrink-0 flex items-center gap-2.5 text-2xl font-black tracking-tight"
          >
            <img
              src="/logo.png"
              alt="Assam StudentHub Logo"
              className="h-9 w-9 object-contain rounded-xl shadow-md shadow-emerald-500/10 bg-white group-hover:scale-105 transition-transform duration-300"
            />
            <div className="leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 font-black tracking-wide text-xs uppercase block font-semibold">Assam</span>
              <span className="text-zinc-900 dark:text-white font-bold text-lg block -mt-0.5 transition-colors duration-200">StudentHub</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <NavLinks items={navigationItems} />

          {/* RIGHT */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="hidden md:flex items-center gap-2.5">
                <Link href="/saved-jobs">
                  <Button variant="secondary" size="sm">
                    Saved
                  </Button>
                </Link>

                <form action={logout} className="flex items-center">
                  <Button variant="secondary" size="sm">
                    Logout
                  </Button>
                </form>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2.5">
                <Link href="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
              </div>
            )}

            <ThemeToggle />

            {/* MOBILE MENU */}
            <MobileMenu items={navigationItems} user={user} />
          </div>
        </Container>
      </header>
    </>
  );
}
