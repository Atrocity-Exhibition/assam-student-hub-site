import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "brand" | "critical" | "muted";
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: Props) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors duration-200";

  const variants = {
    default:
      "border-border bg-card/40 text-foreground",
    brand:
      "border-brand-border bg-brand-bg text-brand",
    critical:
      "border-critical-border bg-critical-bg text-critical",
    muted:
      "border-border bg-card/25 text-muted",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
