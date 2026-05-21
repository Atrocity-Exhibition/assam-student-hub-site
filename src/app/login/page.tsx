import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Login | AssamStudentHub",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">
        <h1 className="text-3xl font-black">
          Login
        </h1>

        <p className="mt-3 text-zinc-400">
          Access bookmarks and saved
          jobs.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 outline-none transition focus:border-red-500/40"
          />

          <input
            type="password"
            placeholder="Password"
            className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 outline-none transition focus:border-red-500/40"
          />

          <button className="h-14 w-full rounded-2xl bg-red-500 font-medium text-white transition hover:bg-red-400">
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
