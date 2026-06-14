import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboardClient from "./admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;

  console.log("=== ADMIN DASHBOARD DEBUG ===");
  console.log("authError:", authError);
  console.log("user:", user ? { id: user.id, email: user.email } : "null");
  console.log("adminEmail from env:", adminEmail);
  console.log("Match:", user && adminEmail ? user.email === adminEmail : "N/A");
  console.log("=============================");

  if (authError || !user || !adminEmail || user.email !== adminEmail) {
    redirect("/");
  }

  return <AdminDashboardClient />;
}
