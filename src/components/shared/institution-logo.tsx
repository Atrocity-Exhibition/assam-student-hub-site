import { cn } from "@/lib/utils";

type Props = {
  logoUrl: string | null | undefined;
  name: string;
  className?: string;
};

export function InstitutionLogo({ logoUrl, name, className = "h-8 w-8" }: Props) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} Logo`}
        className={cn("object-contain rounded-full bg-white dark:bg-white p-0.5 shadow-sm border border-border/30 shrink-0", className)}
        loading="lazy"
      />
    );
  }

  // Fallback: circular gradient with first letter
  const firstLetter = name.trim().charAt(0).toUpperCase() || "N";
  
  // Deterministic gradient selection based on name string character code
  const gradients = [
    "from-blue-500 to-indigo-600 text-white",
    "from-emerald-500 to-teal-600 text-white",
    "from-purple-500 to-indigo-600 text-white",
    "from-amber-500 to-orange-600 text-white",
    "from-pink-500 to-rose-600 text-white",
    "from-cyan-500 to-blue-600 text-white",
  ];
  const charCode = name.charCodeAt(0) || 0;
  const gradient = gradients[charCode % gradients.length];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br font-extrabold select-none shrink-0 shadow-sm border border-white/10",
        gradient,
        className
      )}
    >
      {firstLetter}
    </div>
  );
}

