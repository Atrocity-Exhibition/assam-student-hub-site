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
            className="group shrink-0 flex items-center gap-2.5 text-2xl font-black tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-lg font-black text-white">A</span>
            </div>
            <div className="leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 font-black tracking-wide text-sm uppercase block font-semibold">Assam</span>
              <span className="text-white font-bold text-lg block -mt-0.5">StudentHub</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-emerald-400"
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
                  className="rounded-full border border-zinc-800 px-5 py-2 text-sm transition-all duration-200 hover:border-emerald-500/30 hover:bg-zinc-900 hover:text-emerald-400"
                >
                  Saved
                </Link>

                <form action={logout}>
                  <button className="rounded-full border border-zinc-800 px-5 py-2 text-sm transition-all duration-200 hover:border-emerald-500/30 hover:bg-zinc-900 hover:text-emerald-400">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-zinc-800 px-5 py-2 text-sm transition-all duration-200 hover:border-emerald-500/30 hover:bg-zinc-900 hover:text-emerald-400"
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
