import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { className?: string };

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={`h-12 w-full rounded-2xl border border-border bg-card/45 px-4 text-foreground placeholder:text-muted/65 outline-none transition duration-200 focus-visible:border-brand-border focus-visible:ring-2 focus-visible:ring-brand/15 dark:focus-visible:ring-brand/20 ${className}`}
      {...props}
    />
  );
}
