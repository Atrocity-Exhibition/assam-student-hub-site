"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Play, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

const PIPELINES = [
  {
    id: "scrape-fast.yml",
    name: "Fast Group",
    interval: "Every 6 Hours",
    description: "High priority sources that update frequently.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    id: "scrape-medium.yml",
    name: "Medium Group",
    interval: "Every 12 Hours",
    description: "Standard academic institutions and university boards.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    id: "scrape-slow.yml",
    name: "Slow Group",
    interval: "Every 24 Hours",
    description: "Lower priority sources or those with strict rate limits.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const triggerPipeline = async (workflowId: string) => {
    setLoading(workflowId);
    setStatus(null);

    try {
      const res = await fetch("/api/admin/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow_id: workflowId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to trigger pipeline");
      }

      setStatus({ type: "success", message: data.message });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setStatus({ type: "error", message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Container>
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Pipeline Orchestrator
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Manually dispatch GitHub Actions workflows to scrape data immediately.
          Bypasses the normal cron schedule.
        </p>
      </div>

      {status && (
        <div
          className={`mb-8 flex items-center gap-3 rounded-2xl border p-4 shadow-sm ${
            status.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0" />
          )}
          <p className="text-sm font-semibold">{status.message}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {PIPELINES.map((pipeline) => (
          <div
            key={pipeline.id}
            className={`relative flex flex-col rounded-3xl border bg-card/40 p-6 backdrop-blur-sm transition-all hover:bg-card/60 ${pipeline.border}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${pipeline.bg} ${pipeline.color}`}
              >
                <Clock className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 whitespace-nowrap">
                {pipeline.interval}
              </span>
            </div>

            <h3 className="mb-2 text-xl font-bold text-foreground">
              {pipeline.name}
            </h3>
            <p className="mb-8 flex-1 text-sm text-muted-foreground">
              {pipeline.description}
            </p>

            <button
              onClick={() => triggerPipeline(pipeline.id)}
              disabled={loading !== null}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-foreground px-4 py-3 text-sm font-bold text-background transition-all hover:scale-[1.02] hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
            >
              {loading === pipeline.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dispatching...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  Trigger Now
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
}
