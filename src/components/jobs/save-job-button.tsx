"use client";

import {
  saveJob,
  unsaveJob,
} from "@/app/jobs/actions";

type Props = {
  jobId: number;

  isSaved: boolean;
};

export function SaveJobButton({
  jobId,
  isSaved,
}: Props) {
  return isSaved ? (
    <form
      action={() =>
        unsaveJob(jobId)
      }
    >
      <button className="rounded-2xl border border-red-500 bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-400">
        Saved
      </button>
    </form>
  ) : (
    <form
      action={() =>
        saveJob(jobId)
      }
    >
      <button className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm transition hover:border-red-500/40 hover:bg-zinc-900">
        Save Job
      </button>
    </form>
  );
}
