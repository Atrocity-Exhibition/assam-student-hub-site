"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function saveNotice(
  noticeId: number,
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase
    .from("saved_notices")
    .insert({
      user_id: user.id,
      notice_id: noticeId,
    });

  revalidatePath("/notices");
  revalidatePath("/saved-notices");
}

export async function unsaveNotice(
  noticeId: number,
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase
    .from("saved_notices")
    .delete()
    .eq("user_id", user.id)
    .eq("notice_id", noticeId);

  revalidatePath("/notices");
  revalidatePath("/saved-notices");
}
