"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Reset window scroll position immediately when navigation completes
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      // Fallback for older environments
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}
