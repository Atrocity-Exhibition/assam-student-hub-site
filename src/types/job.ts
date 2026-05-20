export type Job = {
  id: number;

  title: string;

  slug: string;

  description: string | null;

  source: string;

  source_url: string | null;

  location: string | null;

  category: string | null;

  posted_at: string;

  created_at: string;

  apply_url: string | null;

  deadline: string | null;

  eligibility: string | null;

  tags: string[] | null;
};
