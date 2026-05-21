import type { Metadata } from "next";

import {
  login,
  signup,
  signInWithGoogle,
} from "./actions";

export const metadata: Metadata = {
  title:
    "Login | AssamStudentHub",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
        <h1 className="text-3xl font-black">
          Login / Signup
        </h1>

        <p className="mt-3 text-zinc-400">
          Access bookmarks and saved
          jobs.
        </p>

        {/* EMAIL FORM */}
        <form className="mt-8 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 outline-none transition focus:border-red-500/40"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 outline-none transition focus:border-red-500/40"
          />

          <div className="flex gap-3">
            <button
              formAction={login}
              className="h-14 flex-1 rounded-2xl bg-red-500 font-medium text-white transition hover:bg-red-400"
            >
              Login
            </button>

            <button
              formAction={signup}
              className="h-14 flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 font-medium transition hover:border-red-500/40 hover:bg-zinc-900"
            >
              Signup
            </button>
          </div>
        </form>

        {/* DIVIDER */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-800" />

          <span className="text-sm text-zinc-500">
            OR
          </span>

          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        {/* GOOGLE LOGIN */}
        <form action={signInWithGoogle}>
          <button className="flex h-14 w-full items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 font-medium transition hover:border-red-500/40 hover:bg-zinc-900">
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}
