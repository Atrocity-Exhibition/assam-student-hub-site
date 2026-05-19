import { supabase } from "@/lib/supabase";

export async function getJobs() {
  const { data, error } =
    await supabase
      .from("jobs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);

    return [];
  }

  return data;
}

export async function getJobBySlug(
  slug: string,
) {
  const { data, error } =
    await supabase
      .from("jobs")
      .select("*")
      .eq("slug", slug)
      .single();

  if (error) {
    console.error(error);

    return null;
  }

  return data;
}
