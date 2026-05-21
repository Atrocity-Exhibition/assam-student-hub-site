import { supabase } from "@/lib/supabase";

import type { Institution } from "@/types/institution";

export async function getInstitutions(): Promise<
  Institution[]
> {
  const { data, error } =
    await supabase
      .from("institutions")
      .select("*")
      .order("name");

  if (error) {
    console.error(error);

    return [];
  }

  return (
    (data as Institution[]) ||
    []
  );
}

export async function getInstitutionBySlug(
  slug: string,
): Promise<Institution | null> {
  const { data, error } =
    await supabase
      .from("institutions")
      .select("*")
      .eq("slug", slug)
      .single();

  if (error) {
    console.error(error);

    return null;
  }

  return data as Institution;
}
