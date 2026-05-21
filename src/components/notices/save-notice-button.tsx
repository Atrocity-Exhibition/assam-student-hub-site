"use client";

import { useTransition } from "react";
import { saveNotice, unsaveNotice } from "@/app/notices/actions";

type Props = {
  noticeId: number;
  isSaved: boolean;
};

export function SaveNoticeButton({ noticeId, isSaved }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      if (isSaved) {
        await unsaveNotice(noticeId);
      } else {
        await saveNotice(noticeId);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-2xl border px-4 py-2 text-sm font-medium transition duration-300 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 ${
        isSaved
          ? "border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30"
          : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-white"
      }`}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin text-zinc-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : isSaved ? (
        "Saved"
      ) : (
        "Save Notice"
      )}
    </button>
  );
}
