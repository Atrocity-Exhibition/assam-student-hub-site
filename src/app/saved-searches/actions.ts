"use server";

import { saveSavedSearch, deleteSavedSearch } from "@/services/saved-searches";
import { revalidatePath } from "next/cache";

export async function saveSearchAction(
  query: string,
  category?: string | null
): Promise<{ success: boolean; error?: string }> {
  const result = await saveSavedSearch(query, category);
  if (result.success) {
    revalidatePath("/saved-searches");
  }
  return result;
}

export async function deleteSearchAction(
  id: number
): Promise<{ success: boolean }> {
  const result = await deleteSavedSearch(id);
  if (result.success) {
    revalidatePath("/saved-searches");
  }
  return result;
}
