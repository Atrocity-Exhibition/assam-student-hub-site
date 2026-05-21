import { Institution } from "./institution";

export type Notice = {
  id: number;
  title: string;
  description: string | null;
  source: string;
  source_url: string;
  category: string;
  content_type: string | null;
  institution: string;
  institution_slug: string | null;
  scraper_name: string | null;
  posted_at: string | null;
  last_seen_at: string;
  is_active: boolean;
  tags: string[] | null;
  slug: string;
  raw_html: string | null;
  metadata: any | null;
  scraped_at: string;
  created_at: string;
  updated_at: string | null;
  content_hash: string | null;
  attachment_url: string | null;
  institution_id: number | null;
  is_official: boolean;
  merged_into_notice_id: number | null;
  search_rank?: number | null;
  institutions?: Institution | null;
};


