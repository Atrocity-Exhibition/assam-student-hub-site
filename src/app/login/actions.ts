"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=" + encodeURIComponent("Email and password are required."));
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login failed:", error);
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?mode=signup&error=" + encodeURIComponent("Email and password are required."));
  }

  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const redirectUrl = origin ? `${origin}/auth/callback` : `${proto}://${host}/auth/callback`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error("Signup failed:", error);
    redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=" + encodeURIComponent("Registration successful! Please check your email to confirm your account."));
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const redirectUrl = origin ? `${origin}/auth/callback` : `${proto}://${host}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error("Google login failed:", error);
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
