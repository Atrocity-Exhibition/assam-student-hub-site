import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  AlertCircle,
  Trophy,
  Shield,
  School,
  GraduationCap,
  FlaskConical,
  Briefcase,
  Calendar,
  HeartPulse,
  Settings,
  Globe,
  Leaf,
  BookOpen,
  Search,
} from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/home/footer";
import { getRecentRuns, getScraperSummaries } from "@/services/scrapers";

export const revalidate = 60; // Revalidate every 60 seconds

const SCRAPER_DISPLAY_INFO: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  apsc: { label: "APSC Official", icon: Trophy },
  slprb: { label: "SLPRB Assam", icon: Shield },
  gauhati: { label: "Gauhati University", icon: School },
  cotton: { label: "Cotton University", icon: GraduationCap },
  dibrugarh: { label: "Dibrugarh University", icon: FlaskConical },
  assam_career: { label: "Assam Career", icon: Briefcase },
  daily_assam_job: { label: "Daily Assam Job", icon: Calendar },
  nhm_assam: { label: "NHM Assam", icon: HeartPulse },
  aesrb: { label: "AESRB Assam", icon: Settings },
  ncs_portal: { label: "NCS Portal", icon: Globe },
  tezpur: { label: "Tezpur University", icon: School },
  bodoland: { label: "Bodoland University", icon: Leaf },
  mangaldai: { label: "Mangaldai College", icon: School },
  ahsec: { label: "AHSEC Board", icon: BookOpen },
  seba: { label: "SEBA Board", icon: BookOpen },
  // Phase 1
  assam_university: { label: "Assam University", icon: School },
  astu: { label: "ASTU Guwahati", icon: School },
  ghc: { label: "Gauhati High Court", icon: Trophy },
  all_job_assam: { label: "AllJobAssam", icon: Briefcase },
  // Batch 2
  kkhsou: { label: "KKHSOU", icon: School },
  awu: { label: "Assam Women's University", icon: School },
  nrl: { label: "Numaligarh Refinery", icon: Settings },
  assam_job_news: { label: "assamJOBnews", icon: Briefcase },
  // 8 New Colleges/Universities
  darrang_college: { label: "Darrang College", icon: School },
  tezpur_college: { label: "Tezpur College", icon: School },
  lokd_college: { label: "LOKD College", icon: School },
  royal_global: { label: "Royal Global University", icon: School },
  ignou_guwahati: { label: "IGNOU Guwahati", icon: GraduationCap },
  don_bosco: { label: "Assam Don Bosco University", icon: School },
  pandu_college: { label: "Pandu College", icon: School },
  adtu: { label: "Assam Down Town University", icon: School },
};

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) return "In the future";
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDuration(start: string, end: string | null): string {
  if (!end) return "-";
  const durationMs = new Date(end).getTime() - new Date(start).getTime();
  const seconds = durationMs / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export default async function MonitoringPage() {
  const [summaries, recentRuns] = await Promise.all([
    getScraperSummaries(),
    getRecentRuns(20),
  ]);

  const staleScrapers = summaries.filter((s) => s.is_stale);
  const failedScrapersCount = summaries.filter(
    (s) => s.last_run?.status === "failed"
  ).length;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-600 dark:selection:text-emerald-400">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm text-muted-foreground font-semibold uppercase tracking-wider">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              System Status
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              Scraper Monitoring
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Real-time health, expected intervals, execution history, and alerts
              for the AssamStudentHub aggregation pipeline.
            </p>
          </div>

          {/* STALE WARNING ALERT */}
          {staleScrapers.length > 0 && (
            <div className="mb-10 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-md shadow-lg shadow-amber-500/5">
              <div className="flex gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-amber-500">
                    System Alert: Stale Ingestion Pipelines Detected (
                    {staleScrapers.length})
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The following scrapers have not successfully executed within
                    the last 24 hours. Check log outputs or check if the source site
                    structure has changed:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {staleScrapers.map((s) => {
                      const info = SCRAPER_DISPLAY_INFO[s.scraper_name] || {
                        label: s.scraper_name,
                        icon: Search,
                      };
                      const InfoIcon = info.icon;
                      return (
                        <span
                          key={s.scraper_name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300"
                        >
                          <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                          <span>{info.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OVERVIEW STATS */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-md">
              <div className="flex justify-between items-center text-muted-foreground mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Total Scrapers
                </span>
                <Database className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-3xl font-black text-foreground">{summaries.length}</span>
              <span className="text-xs block text-muted-foreground mt-2">
                Active sources tracked
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-md">
              <div className="flex justify-between items-center text-emerald-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Healthy
                </span>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {summaries.length - staleScrapers.length}
              </span>
              <span className="text-xs block text-muted-foreground mt-2">
                Run successfully within 24h
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-md">
              <div className="flex justify-between items-center text-amber-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Stale / Attention
                </span>
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <span
                className={`text-3xl font-black ${
                  staleScrapers.length > 0
                    ? "text-amber-600 dark:text-amber-400 animate-pulse"
                    : "text-muted-foreground"
                }`}
              >
                {staleScrapers.length}
              </span>
              <span className="text-xs block text-muted-foreground mt-2">
                No successful run in 24h
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-md">
              <div className="flex justify-between items-center text-red-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Active Failures
                </span>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <span
                className={`text-3xl font-black ${
                  failedScrapersCount > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                }`}
              >
                {failedScrapersCount}
              </span>
              <span className="text-xs block text-muted-foreground mt-2">
                Failed on last execution
              </span>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="space-y-12">
            {/* CARD GRID - ALL SCRAPERS */}
            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground mb-6 flex flex-wrap items-center gap-2">
                <span>Ingestion Pipelines</span>
                <span className="text-xs font-semibold text-muted-foreground bg-card/80 border border-border px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                  {summaries.length} Sources
                </span>
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {summaries.map((summary) => {
                  const info = SCRAPER_DISPLAY_INFO[summary.scraper_name] || {
                    label: summary.scraper_name,
                    icon: Search,
                  };
                  const InfoIcon = info.icon;
                  const lastRun = summary.last_run;
                  const isStale = summary.is_stale;

                  // Status badge and indicators
                  let statusColor = "bg-muted text-muted-foreground border-border/50";
                  let statusDot = "bg-muted-foreground";
                  let statusText = "No Run Data";

                  if (lastRun) {
                    if (lastRun.status === "running") {
                      statusColor =
                        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
                      statusDot = "bg-blue-500 animate-pulse";
                      statusText = "Running";
                    } else if (lastRun.status === "completed") {
                      statusColor =
                        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
                      statusDot = "bg-emerald-500";
                      statusText = "Completed";
                    } else if (lastRun.status === "failed") {
                      statusColor =
                        "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
                      statusDot = "bg-red-500 animate-pulse";
                      statusText = "Failed";
                    }
                  }

                  return (
                    <div
                      key={summary.scraper_name}
                      className={`group flex flex-col justify-between rounded-3xl border bg-card/30 backdrop-blur-sm p-6 transition duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg min-w-0 ${
                        isStale
                          ? "border-amber-500/25 hover:border-amber-500/40 hover:shadow-amber-500/2"
                          : "border-border hover:border-emerald-500/30 hover:bg-card/50"
                      }`}
                    >
                      <div>
                        {/* TOP: Name & Status */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="flex items-center justify-center h-11 w-11 bg-card/90 rounded-2xl border border-border shrink-0 text-muted-foreground">
                              <InfoIcon className="h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 truncate">
                                {info.label}
                              </h3>
                              <p className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mt-0.5">
                                {summary.scraper_name}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${statusColor}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot}`}
                            ></span>
                            {statusText}
                          </span>
                        </div>

                        {/* MIDDLE: Timers & Staleness */}
                        <div className="mt-6 space-y-2 border-t border-b border-border/60 py-4 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected Interval:</span>
                            <span className="font-semibold text-foreground">
                              {summary.expected_interval === "30m"
                                ? "Every 30 minutes"
                                : summary.expected_interval === "3h"
                                ? "Every 3 hours"
                                : summary.expected_interval === "6h"
                                ? "Every 6 hours"
                                : "Daily (24h)"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Executed:</span>
                            <span className="font-semibold text-foreground">
                              {lastRun ? formatTimeAgo(lastRun.started_at) : "Never"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Success:</span>
                            <span
                              className={`font-semibold ${
                                isStale ? "text-amber-600 dark:text-amber-400 font-bold" : "text-foreground"
                              }`}
                            >
                              {summary.last_success
                                ? formatTimeAgo(summary.last_success.started_at)
                                : "Never"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM: Metrics / Failures */}
                      <div className="mt-5">
                        {lastRun && lastRun.status === "failed" ? (
                          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-3.5 text-[11px] text-red-600 dark:text-red-400 leading-relaxed max-h-[85px] overflow-y-auto scrollbar-hide">
                            <p className="font-bold flex items-center gap-1 mb-1">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Error Details:
                            </p>
                            <p className="break-all font-mono">
                              {lastRun.errors && lastRun.errors.length > 0
                                ? lastRun.errors[lastRun.errors.length - 1]
                                : "Unknown scraper script error."}
                            </p>
                          </div>
                        ) : lastRun ? (
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="rounded-xl bg-card/50 border border-border/40 p-2 min-w-0">
                              <span className="block text-[9px] text-muted-foreground font-bold uppercase tracking-wider truncate">
                                Scraped
                              </span>
                              <span className="text-foreground font-black text-sm block mt-0.5 truncate">
                                {lastRun.items_scraped}
                              </span>
                            </div>
                            <div className="rounded-xl bg-card/50 border border-border/40 p-2 min-w-0">
                              <span className="block text-[9px] text-muted-foreground font-bold uppercase tracking-wider truncate">
                                Inserted
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm block mt-0.5 truncate">
                                {lastRun.items_inserted}
                              </span>
                            </div>
                            <div className="rounded-xl bg-card/50 border border-border/40 p-2 min-w-0">
                              <span className="block text-[9px] text-muted-foreground font-bold uppercase tracking-wider truncate">
                                Updated
                              </span>
                              <span className="text-blue-600 dark:text-blue-400 font-black text-sm block mt-0.5 truncate">
                                {lastRun.items_updated}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2.5 text-muted-foreground text-xs">
                            No statistics recorded for this pipeline.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECENT RUNS HISTORY LOG */}
            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground mb-6 flex flex-wrap items-center gap-2">
                <span>Recent Ingestion Logs</span>
                <span className="text-xs font-semibold text-muted-foreground bg-card/80 border border-border px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                  Last 20 Runs
                </span>
              </h2>

              <div className="overflow-x-auto rounded-3xl border border-border bg-card/20 shadow-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Scraper Name</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Started At</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4 text-center">Scraped</th>
                      <th className="px-6 py-4 text-center">Inserted</th>
                      <th className="px-6 py-4 text-center">Updated</th>
                      <th className="px-6 py-4">Logs/Errors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {recentRuns.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-muted-foreground"
                        >
                          No recent logs recorded in scraper_runs.
                        </td>
                      </tr>
                    ) : (
                      recentRuns.map((run) => {
                        const info = SCRAPER_DISPLAY_INFO[run.scraper_name] || {
                          label: run.scraper_name,
                          icon: Search,
                        };
                        const InfoIcon = info.icon;

                        let statusColor = "bg-muted text-muted-foreground border-border/50";
                        if (run.status === "completed") {
                          statusColor =
                            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
                        } else if (run.status === "failed") {
                          statusColor =
                            "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
                        } else if (run.status === "running") {
                          statusColor =
                            "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
                        }

                        return (
                          <tr
                            key={run.id}
                            className="hover:bg-card/40 transition-colors duration-150 group"
                          >
                            <td className="px-6 py-4 font-semibold text-foreground">
                              <div className="flex items-center gap-2.5">
                                <InfoIcon className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                                <div>
                                  <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                                    {info.label}
                                  </span>
                                  <span className="block text-[10px] text-muted-foreground font-mono mt-0.5">
                                    {run.scraper_name}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor}`}
                              >
                                {run.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground font-medium">
                              {new Date(run.started_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground font-mono">
                              {formatDuration(run.started_at, run.completed_at)}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-foreground">
                              {run.items_scraped}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                              {run.items_inserted}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400">
                              {run.items_updated}
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate text-xs">
                              {run.status === "failed" &&
                              run.errors &&
                              run.errors.length > 0 ? (
                                <span
                                  className="text-red-600 dark:text-red-400 font-mono leading-relaxed"
                                  title={run.errors.join(", ")}
                                >
                                  {run.errors[run.errors.length - 1]}
                                </span>
                              ) : (
                                <span className="text-muted-foreground font-mono">
                                  Healthy status.
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>

        <Footer />
      </main>
    </>
  );
}
