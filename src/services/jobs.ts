import { supabase } from "@/lib/supabase";

type GetJobsOptions = {
  search?: string;

  category?: string;

  page?: number;

  sort?: string;
};

const PAGE_SIZE = 6;

export async function getJobs(
  options?: GetJobsOptions,
) {
  const page =
    options?.page || 1;

  const from =
    (page - 1) * PAGE_SIZE;

  const to =
    from + PAGE_SIZE - 1;

  let query = supabase
    .from("jobs")
    .select("*", {
      count: "exact",
    })
    .range(from, to);

  /* SEARCH */

  if (
    options?.search &&
    options.search.trim() !== ""
  ) {
    query = query.or(
      `
      title.ilike.%${options.search}%,
      description.ilike.%${options.search}%,
      category.ilike.%${options.search}%,
      source.ilike.%${options.search}%
    `,
    );
  }

  /* CATEGORY */

  if (
    options?.category &&
    options.category !== "All"
  ) {
    query = query.eq(
      "category",
      options.category,
    );
  }

  /* SORTING */

  switch (options?.sort) {
    case "oldest":
      query = query.order(
        "created_at",
        {
          ascending: true,
        },
      );
      break;

    case "alphabetical":
      query = query.order(
        "title",
        {
          ascending: true,
        },
      );
      break;

    default:
      query = query.order(
        "created_at",
        {
          ascending: false,
        },
      );
  }

  const {
    data,
    error,
    count,
  } = await query;

  if (error) {
    console.error(error);

    return {
      jobs: [],
      totalPages: 1,
    };
  }

  return {
    jobs: data || [],

    totalPages: Math.max(
      1,
      Math.ceil(
        (count || 0) / PAGE_SIZE,
      ),
    ),
  };
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
