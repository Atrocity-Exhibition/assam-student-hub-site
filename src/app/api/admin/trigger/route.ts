import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const adminEmail = process.env.ADMIN_EMAIL;

    if (authError || !user || !adminEmail || user.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workflow_id } = await req.json();

    if (!workflow_id) {
      return NextResponse.json({ error: "Missing workflow_id" }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_ACCESS_TOKEN;
    const githubRepo = process.env.GITHUB_REPOSITORY;

    if (!githubToken || !githubRepo) {
      return NextResponse.json(
        { error: "Server missing GITHUB_ACCESS_TOKEN or GITHUB_REPOSITORY" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.github.com/repos/${githubRepo}/actions/workflows/${workflow_id}/dispatches`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${githubToken}`,
        },
        body: JSON.stringify({
          ref: "main", // The branch to run the workflow on
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `GitHub API Error: ${errorText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully triggered ${workflow_id}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
