export type ScraperRun = {
  id: number;
  scraper_name: string;
  status: "running" | "completed" | "failed";
  started_at: string;
  completed_at: string | null;
  items_scraped: number;
  items_inserted: number;
  items_updated: number;
  errors: string[] | null;
  created_at: string;
};

export type ScraperSummary = {
  scraper_name: string;
  expected_interval: string; // "30m", "3h", "6h", "24h"
  last_run: ScraperRun | null;
  last_success: ScraperRun | null;
  is_stale: boolean;
};
