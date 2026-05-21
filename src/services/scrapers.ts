import { supabase } from "@/lib/supabase";
import type { ScraperRun, ScraperSummary } from "@/types/scraper";

const EXPECTED_INTERVALS: Record<string, string> = {
  apsc: "30m",
  slprb: "30m",
  dibrugarh: "3h",
  gauhati: "6h",
  cotton: "6h",
  assam_career: "24h",
  daily_assam_job: "24h",
  nhm_assam: "24h",
  aesrb: "24h",
  ncs_portal: "24h",
  tezpur: "24h",
  bodoland: "24h",
  mangaldai: "24h",
  ahsec: "24h",
  seba: "24h",
};

const SCRAPER_NAMES = [
  "apsc",
  "slprb",
  "gauhati",
  "cotton",
  "dibrugarh",
  "assam_career",
  "daily_assam_job",
  "nhm_assam",
  "aesrb",
  "ncs_portal",
  "tezpur",
  "bodoland",
  "mangaldai",
  "ahsec",
  "seba",
];

export async function getRecentRuns(limit: number = 20): Promise<ScraperRun[]> {
  const { data, error } = await supabase
    .from("scraper_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent runs:", error);
    return [];
  }

  return (data as ScraperRun[]) || [];
}

export async function getScraperSummaries(): Promise<ScraperSummary[]> {
  // Fetch the latest 300 runs to cover the latest runs for all 15 scrapers
  const { data: runs, error } = await supabase
    .from("scraper_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(300);

  if (error) {
    console.error("Error fetching scraper runs for summary:", error);
    return SCRAPER_NAMES.map((name) => ({
      scraper_name: name,
      expected_interval: EXPECTED_INTERVALS[name] || "24h",
      last_run: null,
      last_success: null,
      is_stale: false,
    }));
  }

  const latestRunsMap = new Map<string, ScraperRun>();
  const latestSuccessMap = new Map<string, ScraperRun>();

  if (runs) {
    for (const run of runs) {
      if (!latestRunsMap.has(run.scraper_name)) {
        latestRunsMap.set(run.scraper_name, run as ScraperRun);
      }
      if (run.status === "completed" && !latestSuccessMap.has(run.scraper_name)) {
        latestSuccessMap.set(run.scraper_name, run as ScraperRun);
      }
    }
  }

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return SCRAPER_NAMES.map((name) => {
    const lastRun = latestRunsMap.get(name) || null;
    const lastSuccess = latestSuccessMap.get(name) || null;
    const intervalStr = EXPECTED_INTERVALS[name] || "24h";

    // A scraper is marked stale if there has been no successful run in the last 24 hours
    let isStale = false;
    if (!lastSuccess) {
      isStale = true; // Never successfully run
    } else {
      const successTime = new Date(lastSuccess.started_at);
      if (successTime < oneDayAgo) {
        isStale = true;
      }
    }

    return {
      scraper_name: name,
      expected_interval: intervalStr,
      last_run: lastRun,
      last_success: lastSuccess,
      is_stale: isStale,
    };
  });
}
