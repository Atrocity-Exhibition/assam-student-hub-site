import type {
  ButtonHTMLAttributes,
} from "react";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | "primary"
      | "secondary";
  };

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  const variants = {
    primary:
      "bg-red-500 text-white hover:bg-red-400 border-red-500",

    secondary:
      "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-red-500/40 hover:bg-zinc-900 hover:text-white",
  };

  return (
    <button
      className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
