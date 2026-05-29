import type { Metadata } from "next";
import Link from "next/link";
import {
  login,
  signup,
  signInWithGoogle,
} from "./actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication | AssamStudentHub",
  description: "Sign in or create an account on AssamStudentHub to manage alerts, jobs, and student notifications.",
};

export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    mode?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message, mode } = await searchParams;
  const isSignup = mode === "signup";

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12 md:px-6 overflow-hidden">
      {/* Premium Background Glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      {/* Floating Back to Home Navigation */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full border border-border bg-card/45 px-4 py-2 text-xs font-semibold text-muted backdrop-blur-sm transition-all hover:bg-card hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md rounded-3xl border border-border bg-card/65 p-8 shadow-xl backdrop-blur-md animate-fade-in relative z-10">
        {/* Card subtle border light overlay */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* LOGO & TEXT */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="group flex flex-col items-center gap-2">
            <img
              src="/logo.png"
              alt="Assam StudentHub Logo"
              className="h-14 w-14 object-contain rounded-2xl shadow-md shadow-emerald-500/10 bg-white group-hover:scale-105 transition-transform duration-300"
            />
            <div className="leading-none mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 font-black tracking-widest text-xs uppercase block text-center">Assam</span>
              <span className="text-zinc-900 dark:text-white font-black text-xl block mt-0.5 transition-colors duration-200">StudentHub</span>
            </div>
          </Link>
          <p className="mt-3 text-muted text-xs max-w-xs leading-relaxed">
            {isSignup
              ? "Join Assam's premier student hub for notifications, scholarships, and careers."
              : "Sign in to access bookmarked notices, application deadlines, and student features."}
          </p>
        </div>

        {/* ALERTS */}
        {(error || message) && (
          <div className="mt-6 space-y-3">
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-critical-border bg-critical-bg p-4 text-xs text-critical">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{decodeURIComponent(error)}</span>
              </div>
            )}
            {message && (
              <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-bg p-4 text-xs text-brand-text">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{decodeURIComponent(message)}</span>
              </div>
            )}
          </div>
        )}

        {/* FORM CONTAINER */}
        <form className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted tracking-widest uppercase px-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-2xl border border-border bg-card/30 pl-11 pr-4 text-sm text-foreground placeholder:text-muted/50 outline-none transition focus:border-brand/40 focus:ring-1 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted tracking-widest uppercase px-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="h-12 w-full rounded-2xl border border-border bg-card/30 pl-11 pr-4 text-sm text-foreground placeholder:text-muted/50 outline-none transition focus:border-brand/40 focus:ring-1 focus:ring-brand/40"
              />
            </div>
          </div>

          <Button
            formAction={isSignup ? signup : login}
            variant="primary"
            className="h-12 w-full mt-2 font-semibold transition-all hover:scale-[1.01]"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </Button>
        </form>

        {/* MODE TOGGLE LINK */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-brand-text hover:underline"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href="/login?mode=signup"
                  className="font-semibold text-brand-text hover:underline"
                >
                  Create one
                </Link>
              </>
            )}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest whitespace-nowrap">
            or continue with
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* GOOGLE LOGIN */}
        <form action={signInWithGoogle}>
          <Button
            variant="secondary"
            className="h-12 w-full flex items-center justify-center gap-2 hover:bg-card/85 transition-all text-xs font-semibold hover:scale-[1.01]"
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </form>
      </div>
    </main>
  );
}
