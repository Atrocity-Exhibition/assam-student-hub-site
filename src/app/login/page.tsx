import type { Metadata } from "next";

import {
  login,
  signup,
  signInWithGoogle,
} from "./actions";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Login | AssamStudentHub",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card/70 p-8 shadow-sm backdrop-blur-sm">
        <h1 className="text-3xl font-black text-foreground">
          Login / Signup
        </h1>

        <p className="mt-3 text-muted text-sm">
          Access bookmarks, saved jobs, and personalized notices.
        </p>

        {/* EMAIL FORM */}
        <form className="mt-8 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="h-14 w-full rounded-2xl border border-border bg-card/50 px-4 text-foreground placeholder:text-muted/70 outline-none transition focus:border-emerald-500/40"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="h-14 w-full rounded-2xl border border-border bg-card/50 px-4 text-foreground placeholder:text-muted/70 outline-none transition focus:border-emerald-500/40"
          />

          <div className="flex gap-3">
            <Button
              formAction={login}
              variant="primary"
              className="h-14 flex-1"
            >
              Login
            </Button>

            <Button
              formAction={signup}
              variant="secondary"
              className="h-14 flex-1"
            >
              Signup
            </Button>
          </div>
        </form>

        {/* DIVIDER */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            OR
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* GOOGLE LOGIN */}
        <form action={signInWithGoogle}>
          <Button variant="secondary" className="h-14 w-full">
            Continue with Google
          </Button>
        </form>
      </div>
    </main>
  );
}
