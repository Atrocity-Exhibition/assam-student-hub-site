import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "critical" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Props) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-primary-foreground border border-primary hover:bg-primary/95 shadow-sm active:scale-[0.98]",
    secondary:
      "border border-border bg-card/45 text-foreground hover:bg-card hover:border-zinc-400 dark:hover:border-zinc-700 active:scale-[0.98]",
    critical:
      "border border-critical-border bg-critical-bg text-critical hover:bg-critical-bg/80 hover:border-critical/30 active:scale-[0.98]",
    ghost:
      "border border-transparent bg-transparent text-muted hover:bg-zinc-200/80 dark:hover:bg-zinc-900/60 hover:text-foreground",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs rounded-full",
    md: "px-5 py-2.5 text-sm rounded-2xl",
    lg: "px-6 py-3.5 text-base rounded-2xl",
    icon: "h-9 w-9 p-0 rounded-full",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
