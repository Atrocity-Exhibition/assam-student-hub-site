import { createClient } from "@/lib/supabase/server";
import type { Notice } from "@/types/notice";

export async function getSavedNotices(): Promise<Notice[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Fetch from saved_notices table, joining both notices and nested institutions
  const { data, error } = await supabase
    .from("saved_notices")
    .select(`
      notices (
        *,
        institutions (*)
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error in getSavedNotices:", error);
    return [];
  }

  return (
    data
      ?.map((item) => {
        const notices = item.notices;
        return Array.isArray(notices) ? notices[0] : notices;
      })
      .filter(Boolean) || []
  ) as unknown as Notice[];
}
