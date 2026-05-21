import { createClient } from "@/lib/supabase/server";

export type SavedSearch = {
  id: number;
  user_id: string;
  query: string;
  category: string | null;
  label: string | null;
  notify_enabled: boolean;
  last_checked_at: string;
  created_at: string;
};

export async function getSavedSearches(): Promise<SavedSearch[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved searches:", error);
    return [];
  }

  return (data as SavedSearch[]) || [];
}

export async function saveSavedSearch(
  query: string,
  category?: string | null,
  label?: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase.from("saved_searches").upsert(
    {
      user_id: user.id,
      query: query.trim(),
      category: category ?? null,
      label: label ?? null,
      last_checked_at: new Date().toISOString(),
    },
    { onConflict: "user_id,query,category" }
  );

  if (error) {
    console.error("Error saving search:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteSavedSearch(
  id: number
): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase
    .from("saved_searches")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting saved search:", error);
    return { success: false };
  }

  return { success: true };
}
