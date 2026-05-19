import { supabase } from "@/lib/supabase";

type GetJobsOptions = {
  search?: string;
};

export async function getJobs(
  options?: GetJobsOptions,
) {
  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  /* SEARCH */

  if (
    options?.search &&
    options.search.trim() !== ""
  ) {
    query = query.ilike(
      "title",
      `%${options.search}%`,
    );
  }

  const { data, error } =
    await query;

  if (error) {
    console.error(error);

    return [];
  }

  return data || [];
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
