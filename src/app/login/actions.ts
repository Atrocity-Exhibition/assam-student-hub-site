"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(
  formData: FormData,
) {
  const supabase =
    await createClient();

  const email = String(
    formData.get("email"),
  );

  const password = String(
    formData.get("password"),
  );

  const { error } =
    await supabase.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

  if (error) {
    console.error(error);

    return;
  }

  redirect("/");
}

export async function signup(
  formData: FormData,
) {
  const supabase =
    await createClient();

  const email = String(
    formData.get("email"),
  );

  const password = String(
    formData.get("password"),
  );

  const { error } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (error) {
    console.error(error);

    return;
  }

  redirect("/");
}

export async function signInWithGoogle() {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase.auth.signInWithOAuth(
      {
        provider: "google",

        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
        },
      },
    );

  if (error) {
    console.error(error);

    return;
  }

  redirect(data.url);
}

export async function logout() {
  const supabase =
    await createClient();

  await supabase.auth.signOut();

  redirect("/");
}
