"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, FileSpreadsheet, BookOpen, Code, ExternalLink } from "lucide-react";

type AdCardProps = {
  variant?: "sidebar" | "grid" | "horizontal";
  index?: number;
};

type AdSenseAdProps = {
  clientId: string;
  slot: string;
  format?: string;
  responsive?: string;
  style?: React.CSSProperties;
};

function AdSenseAd({ clientId, slot, format = "auto", responsive = "true", style }: AdSenseAdProps) {
  const initiated = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!clientId) return;
    if (initiated.current) return;
    initiated.current = true;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense trigger error:", err);
    }
  }, [mounted, clientId]);

  if (!mounted) {
    const minHeight = style?.minHeight || "250px";
    return (
      <div className="w-full flex justify-center py-2 z-10 animate-pulse">
        <div style={{ display: "block", minHeight }} className="w-full bg-card/20 rounded-2xl border border-border/40" />
      </div>
    );
  }

  return (
    <div className="adsense-container w-full overflow-hidden flex justify-center py-2 z-10">
      <ins
        className="adsbygoogle"
        style={style || { display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

const SPONSOR_ADS = [
  {
    id: "apsc-mock",
    title: "APSC 2026 Test Series",
    description: "Access 25 full-length mock exams prepared by civil service mentors in Assam. 85% match rate in previous prelims.",
    badge: "Preparation Pro",
    cta: "Start Free Mock",
    url: "/browse?category=Exam&search=apsc",
    iconName: "GraduationCap" as const,
    gradient: "from-brand/15 via-brand/5 to-transparent",
    accentColor: "text-brand border-brand/20 bg-brand/10",
    buttonBg: "bg-brand hover:bg-brand/90 text-primary-foreground shadow-brand/10"
  },
  {
    id: "resume-builder",
    title: "Student Resume Builder",
    description: "Generate a professional, PDF resume optimized for Assam recruitment boards and government applications in 5 minutes.",
    badge: "100% Free Tool",
    cta: "Build Resume Now",
    url: "/browse",
    iconName: "FileSpreadsheet" as const,
    gradient: "from-blue-500/15 via-indigo-500/5 to-transparent",
    accentColor: "text-blue-500 border-blue-500/20 bg-blue-500/10",
    buttonBg: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
  },
  {
    id: "gk-handbook",
    title: "Assam GK & Budget 2026",
    description: "Master state geography, history, and the latest budget figures with the most recommended handbook for competitive exams.",
    badge: "Study Materials",
    cta: "Download E-Book",
    url: "/browse?category=notice&search=gk",
    iconName: "BookOpen" as const,
    gradient: "from-amber-500/15 via-orange-500/5 to-transparent",
    accentColor: "text-amber-500 border-amber-500/20 bg-amber-500/10",
    buttonBg: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/10"
  },
  {
    id: "coding-bootcamp",
    title: "Full-Stack Web Mentorship",
    description: "Learn Next.js, Supabase, and TailwindCSS in a hands-on project-based program. Build real-world apps and secure referrals.",
    badge: "Placement Track",
    cta: "View Syllabus",
    url: "/changelog",
    iconName: "Code" as const,
    gradient: "from-purple-500/15 via-fuchsia-500/5 to-transparent",
    accentColor: "text-purple-500 border-purple-500/20 bg-purple-500/10",
    buttonBg: "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/10"
  }
];

const IconMap = {
  GraduationCap,
  FileSpreadsheet,
  BookOpen,
  Code
};

export function AdCard({ variant = "sidebar", index = 0 }: AdCardProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (clientId) {
    const slotSidebar = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "1234567890";
    const slotGrid = process.env.NEXT_PUBLIC_ADSENSE_SLOT_GRID || "2345678901";
    const slotHorizontal = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || "3456789012";

    if (variant === "sidebar") {
      return (
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-2.5 right-3 text-[9px] font-bold text-muted-foreground/60 tracking-widest uppercase z-20">
            Advertisement
          </div>
          <div className="pt-2">
            <AdSenseAd clientId={clientId} slot={slotSidebar} style={{ display: "block", minHeight: "250px" }} />
          </div>
        </div>
      );
    }

    if (variant === "grid") {
      return (
        <div className="group h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border bg-card/30 p-4 sm:p-6 shadow-sm min-h-[190px] sm:min-h-[210px] relative overflow-hidden transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-card/50">
          <div className="absolute top-2.5 right-3 text-[9px] font-bold text-muted-foreground/60 tracking-widest uppercase z-20">
            Advertisement
          </div>
          <div className="w-full h-full flex items-center justify-center pt-4">
            <AdSenseAd clientId={clientId} slot={slotGrid} style={{ display: "block", width: "100%", height: "100%", minHeight: "150px" }} />
          </div>
        </div>
      );
    }

    if (variant === "horizontal") {
      return (
        <div className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-4 sm:p-6 md:p-8 mt-10">
          <div className="absolute top-2.5 right-4 text-[9px] font-bold text-muted-foreground/60 tracking-widest uppercase z-20">
            Advertisement
          </div>
          <div className="pt-2">
            <AdSenseAd clientId={clientId} slot={slotHorizontal} style={{ display: "block", minHeight: "90px" }} />
          </div>
        </div>
      );
    }
  }

  // Fallback to beautiful mock sponsored ads
  const ad = SPONSOR_ADS[index % SPONSOR_ADS.length];
  const Icon = IconMap[ad.iconName];

  if (variant === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-4 sm:p-6 md:p-8 mt-10 transition-colors duration-300 hover:border-zinc-400 dark:hover:border-zinc-700"
      >
        {/* Background Gradient Circle */}
        <div className={`absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-gradient-to-br ${ad.gradient} blur-3xl opacity-60`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl border shrink-0 ${ad.accentColor}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${ad.accentColor}`}>
                  {ad.badge}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Sponsored
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-foreground">
                {ad.title}
              </h3>
              <p className="mt-1 text-sm text-muted leading-relaxed max-w-2xl">
                {ad.description}
              </p>
            </div>
          </div>
          <Link href={ad.url} className="shrink-0 self-start md:self-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-lg transition-all ${ad.buttonBg}`}
            >
              <span>{ad.cta}</span>
              <ExternalLink className="h-4 w-4" />
            </motion.div>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (variant === "grid") {
    return (
      <Link href={ad.url} className="block h-full">
        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -2 }}
          className="group h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border bg-card/30 p-4 sm:p-6 shadow-sm min-h-[190px] sm:min-h-[210px] relative overflow-hidden transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-card/50"
        >
          {/* Subtle Accent Glow */}
          <div className={`absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br ${ad.gradient} blur-2xl opacity-50`} />

          <div className="relative z-10 flex gap-4 h-full flex-col justify-between">
            <div className="w-full">
              <div className="flex items-center justify-between gap-4 mb-3.5">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${ad.accentColor}`}>
                  {ad.badge}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Sponsored Ad
                </span>
              </div>

              <div className="flex gap-3">
                <div className={`p-2.5 h-10 w-10 rounded-xl border shrink-0 flex items-center justify-center ${ad.accentColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold leading-snug text-foreground group-hover:text-brand transition-colors duration-300">
                    {ad.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-muted">
                    {ad.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-3.5 w-full">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Partner Promotion
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-black text-foreground group-hover:text-brand transition-colors duration-300">
                {ad.cta}
                <ExternalLink className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5 duration-200" />
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    );
  }

  // Default "sidebar" vertical card
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl sm:rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700"
    >
      {/* Background radial glow */}
      <div className={`absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gradient-to-br ${ad.gradient} blur-2xl opacity-60`} />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${ad.accentColor}`}>
            {ad.badge}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Sponsored
          </span>
        </div>

        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-2xl border shrink-0 ${ad.accentColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-foreground leading-tight">
              {ad.title}
            </h4>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">
              {ad.description}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link href={ad.url} className="block w-full">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full flex items-center justify-center gap-1.5 rounded-2xl px-4 py-3 text-center text-xs font-bold transition-all duration-300 shadow-md ${ad.buttonBg}`}
            >
              <span>{ad.cta}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
