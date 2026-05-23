"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
};

type Props = {
  items: NavItem[];
};

export function NavLinks({ items }: Props) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
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
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "text-brand bg-brand-bg font-semibold"
                : "text-zinc-600 hover:text-brand dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 dark:hover:text-brand"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
