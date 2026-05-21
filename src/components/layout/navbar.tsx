import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { logout } from "@/app/login/actions";

import { Container } from "./container";
import { MobileMenu } from "./mobile-menu";

const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Notices",
    href: "/notices",
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
];


export async function Navbar() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            {user ? (
              <>
                <Link
                  href="/saved-notices"
                  className="rounded-full border border-zinc-800 px-5 py-2 text-sm transition hover:border-red-500/40 hover:bg-zinc-900"
                >
                  Saved
                </Link>

                <form action={logout}>
                  <button className="rounded-full border border-zinc-800 px-5 py-2 text-sm transition hover:border-red-500/40 hover:bg-zinc-900">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-zinc-800 px-5 py-2 text-sm transition hover:border-red-500/40 hover:bg-zinc-900"
              >
                Login
              </Link>
            )}

            {/* MOBILE MENU */}
            <MobileMenu items={navigationItems} />
          </div>
        </Container>
      </header>
    </>
  );
}
