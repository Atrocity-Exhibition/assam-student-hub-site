import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { getInstitutions } from "@/services/institutions";

// Cache sitemap DB queries for 1 hour (3600 seconds)
export const revalidate = 3600;

const BASE_URL = "https://assamstudenthub.com";
const NOTICES_PER_SITEMAP = 1000;

const CATEGORY_SLUGS = [
  "recruitment",
  "results",
  "exams",
  "admissions",
  "scholarships",
  "notices",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ---- 1. Static routes ----
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/notices`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/institutions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // ---- 2. Category routes ----
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/categories/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // ---- 3. Institution routes ----
  let institutionRoutes: MetadataRoute.Sitemap = [];
  try {
    const institutions = await getInstitutions();
    institutionRoutes = institutions.map((inst) => ({
      url: `${BASE_URL}/institutions/${inst.slug}`,
      lastModified: new Date(inst.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap: Failed to fetch institutions:", err);
  }

  // ---- 4. Notice routes (chunked in batches, only active non-duplicate) ----
  let noticeRoutes: MetadataRoute.Sitemap = [];
  try {
    // Fetch all slugs + updated_at for active, non-merged notices
    const { data: noticesData, error } = await supabase
      .from("notices")
      .select("slug, updated_at, scraped_at")
      .eq("is_active", true)
      .is("merged_into_notice_id", null)
      .order("scraped_at", { ascending: false });

    if (error) {
      console.error("Sitemap: Error fetching notices:", error);
    } else if (noticesData) {
      noticeRoutes = noticesData.map((notice) => ({
        url: `${BASE_URL}/notices/${notice.slug}`,
        lastModified: notice.updated_at
          ? new Date(notice.updated_at)
          : new Date(notice.scraped_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error("Sitemap: Failed to fetch notices:", err);
  }

  // Chunk notices into groups of NOTICES_PER_SITEMAP if needed
  // (For very large datasets. Currently returning all in one sitemap.)
  // Next.js App Router auto-handles sitemap index when the array is large.
  const noticeChunks: MetadataRoute.Sitemap[] = [];
  for (let i = 0; i < noticeRoutes.length; i += NOTICES_PER_SITEMAP) {
    noticeChunks.push(noticeRoutes.slice(i, i + NOTICES_PER_SITEMAP));
  }

  // Flatten all sitemaps
  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...institutionRoutes,
    ...noticeRoutes,
  ];
}
