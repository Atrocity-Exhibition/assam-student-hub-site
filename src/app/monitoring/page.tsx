import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  AlertCircle,
} from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import { Footer } from "@/components/home/footer";
import { getRecentRuns, getScraperSummaries } from "@/services/scrapers";

export const revalidate = 60; // Revalidate every 60 seconds

const SCRAPER_DISPLAY_INFO: Record<string, { label: string; icon: string }> = {
  apsc: { label: "APSC Official", icon: "🏆" },
  slprb: { label: "SLPRB Assam", icon: "👮" },
  gauhati: { label: "Gauhati University", icon: "🏛️" },
  cotton: { label: "Cotton University", icon: "🎓" },
  dibrugarh: { label: "Dibrugarh University", icon: "🔬" },
  assam_career: { label: "Assam Career", icon: "💼" },
  daily_assam_job: { label: "Daily Assam Job", icon: "📅" },
  nhm_assam: { label: "NHM Assam", icon: "🏥" },
  aesrb: { label: "AESRB Assam", icon: "⚙️" },
  ncs_portal: { label: "NCS Portal", icon: "🌐" },
  tezpur: { label: "Tezpur University", icon: "🏫" },
  bodoland: { label: "Bodoland University", icon: "🌿" },
  mangaldai: { label: "Mangaldai College", icon: "🏫" },
  ahsec: { label: "AHSEC Board", icon: "📝" },
  seba: { label: "SEBA Board", icon: "📝" },
};

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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

      <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 selection:text-red-400">
        <Container className="py-14">
          {/* HEADER */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 font-semibold uppercase tracking-wider">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              System Status
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-zinc-100">
              Scraper Monitoring
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
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
                  <h2 className="text-lg font-bold text-amber-400">
                    System Alert: Stale Ingestion Pipelines Detected (
                    {staleScrapers.length})
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    The following scrapers have not successfully executed within
                    the last 24 hours. Check log outputs or check if the source site
                    structure has changed:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {staleScrapers.map((s) => {
                      const info = SCRAPER_DISPLAY_INFO[s.scraper_name] || {
                        label: s.scraper_name,
                        icon: "🔍",
                      };
                      return (
                        <span
                          key={s.scraper_name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300"
                        >
                          <span>{info.icon}</span>
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
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/15 backdrop-blur-sm p-6 shadow-md">
              <div className="flex justify-between items-center text-zinc-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Total Scrapers
                </span>
                <Database className="h-5 w-5 text-zinc-400" />
              </div>
              <span className="text-3xl font-black">{summaries.length}</span>
              <span className="text-xs block text-zinc-500 mt-2">
                Active sources tracked
              </span>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/15 backdrop-blur-sm p-6 shadow-md">
              <div className="flex justify-between items-center text-emerald-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Healthy
                </span>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-3xl font-black text-emerald-400">
                {summaries.length - staleScrapers.length}
              </span>
              <span className="text-xs block text-zinc-500 mt-2">
                Run successfully within 24h
              </span>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/15 backdrop-blur-sm p-6 shadow-md">
              <div className="flex justify-between items-center text-amber-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Stale / Attention
                </span>
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <span
                className={`text-3xl font-black ${
                  staleScrapers.length > 0
                    ? "text-amber-400 animate-pulse"
                    : "text-zinc-400"
                }`}
              >
                {staleScrapers.length}
              </span>
              <span className="text-xs block text-zinc-500 mt-2">
                No successful run in 24h
              </span>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/15 backdrop-blur-sm p-6 shadow-md">
              <div className="flex justify-between items-center text-red-500 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Active Failures
                </span>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <span
                className={`text-3xl font-black ${
                  failedScrapersCount > 0 ? "text-red-500" : "text-zinc-400"
                }`}
              >
                {failedScrapersCount}
              </span>
              <span className="text-xs block text-zinc-500 mt-2">
                Failed on last execution
              </span>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="space-y-12">
            {/* CARD GRID - ALL SCRAPERS */}
            <div>
              <h2 className="text-2xl font-black tracking-tight text-zinc-100 mb-6 flex items-center gap-2">
                <span>Ingestion Pipelines</span>
                <span className="text-xs font-semibold text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-full">
                  {summaries.length} Sources
                </span>
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {summaries.map((summary) => {
                  const info = SCRAPER_DISPLAY_INFO[summary.scraper_name] || {
                    label: summary.scraper_name,
                    icon: "🔍",
                  };
                  const lastRun = summary.last_run;
                  const isStale = summary.is_stale;

                  // Status badge and indicators
                  let statusColor = "bg-zinc-800 text-zinc-400 border-zinc-700/50";
                  let statusDot = "bg-zinc-500";
                  let statusText = "No Run Data";

                  if (lastRun) {
                    if (lastRun.status === "running") {
                      statusColor =
                        "bg-blue-500/10 text-blue-400 border-blue-500/20";
                      statusDot = "bg-blue-500 animate-pulse";
                      statusText = "Running";
                    } else if (lastRun.status === "completed") {
                      statusColor =
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                      statusDot = "bg-emerald-500";
                      statusText = "Completed";
                    } else if (lastRun.status === "failed") {
                      statusColor =
                        "bg-red-500/10 text-red-400 border-red-500/20";
                      statusDot = "bg-red-500 animate-pulse";
                      statusText = "Failed";
                    }
                  }

                  return (
                    <div
                      key={summary.scraper_name}
                      className={`group flex flex-col justify-between rounded-3xl border bg-zinc-900/10 backdrop-blur-sm p-6 transition duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg ${
                        isStale
                          ? "border-amber-500/20 hover:border-amber-500/35 hover:shadow-amber-500/2"
                          : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/20"
                      }`}
                    >
                      <div>
                        {/* TOP: Name & Status */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl bg-zinc-900/85 p-2.5 rounded-2xl border border-zinc-800 shrink-0">
                              {info.icon}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-zinc-100 group-hover:text-red-400 transition-colors duration-200 truncate">
                                {info.label}
                              </h3>
                              <p className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase mt-0.5">
                                {summary.scraper_name}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusColor}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusDot}`}
                            ></span>
                            {statusText}
                          </span>
                        </div>

                        {/* MIDDLE: Timers & Staleness */}
                        <div className="mt-6 space-y-2 border-t border-b border-zinc-900/80 py-4 text-xs">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Expected Interval:</span>
                            <span className="font-semibold text-zinc-300">
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
                            <span className="text-zinc-500">Last Executed:</span>
                            <span className="font-semibold text-zinc-300">
                              {lastRun ? formatTimeAgo(lastRun.started_at) : "Never"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Last Success:</span>
                            <span
                              className={`font-semibold ${
                                isStale ? "text-amber-400 font-bold" : "text-zinc-300"
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
                          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-3.5 text-[11px] text-red-400 leading-relaxed max-h-[85px] overflow-y-auto scrollbar-hide">
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
                            <div className="rounded-xl bg-zinc-900/50 border border-zinc-900 p-2">
                              <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                                Scraped
                              </span>
                              <span className="text-zinc-300 font-black text-sm block mt-0.5">
                                {lastRun.items_scraped}
                              </span>
                            </div>
                            <div className="rounded-xl bg-zinc-900/50 border border-zinc-900 p-2">
                              <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                                Inserted
                              </span>
                              <span className="text-emerald-400 font-black text-sm block mt-0.5">
                                {lastRun.items_inserted}
                              </span>
                            </div>
                            <div className="rounded-xl bg-zinc-900/50 border border-zinc-900 p-2">
                              <span className="block text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                                Updated
                              </span>
                              <span className="text-blue-400 font-black text-sm block mt-0.5">
                                {lastRun.items_updated}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2.5 text-zinc-650 text-xs">
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
              <h2 className="text-2xl font-black tracking-tight text-zinc-100 mb-6 flex items-center gap-2">
                <span>Recent Ingestion Logs</span>
                <span className="text-xs font-semibold text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-full">
                  Last 20 Runs
                </span>
              </h2>

              <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/5 shadow-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase tracking-wider">
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
                  <tbody className="divide-y divide-zinc-900/80">
                    {recentRuns.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-zinc-500"
                        >
                          No recent logs recorded in scraper_runs.
                        </td>
                      </tr>
                    ) : (
                      recentRuns.map((run) => {
                        const info = SCRAPER_DISPLAY_INFO[run.scraper_name] || {
                          label: run.scraper_name,
                          icon: "🔍",
                        };

                        let statusColor = "bg-zinc-800 text-zinc-400 border-zinc-700/50";
                        if (run.status === "completed") {
                          statusColor =
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                        } else if (run.status === "failed") {
                          statusColor =
                            "bg-red-500/10 text-red-400 border-red-500/20";
                        } else if (run.status === "running") {
                          statusColor =
                            "bg-blue-500/10 text-blue-400 border-blue-500/20";
                        }

                        return (
                          <tr
                            key={run.id}
                            className="hover:bg-zinc-900/20 transition-colors duration-150 group"
                          >
                            <td className="px-6 py-4 font-semibold text-zinc-200">
                              <div className="flex items-center gap-2">
                                <span className="text-lg shrink-0">{info.icon}</span>
                                <div>
                                  <span className="group-hover:text-red-400 transition-colors duration-200">
                                    {info.label}
                                  </span>
                                  <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">
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
                            <td className="px-6 py-4 text-zinc-400 font-medium">
                              {new Date(run.started_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4 text-zinc-400 font-mono">
                              {formatDuration(run.started_at, run.completed_at)}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-zinc-300">
                              {run.items_scraped}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-emerald-400">
                              {run.items_inserted}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-blue-400">
                              {run.items_updated}
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate text-xs">
                              {run.status === "failed" &&
                              run.errors &&
                              run.errors.length > 0 ? (
                                <span
                                  className="text-red-400 font-mono leading-relaxed"
                                  title={run.errors.join(", ")}
                                >
                                  {run.errors[run.errors.length - 1]}
                                </span>
                              ) : (
                                <span className="text-zinc-500 font-mono">
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
