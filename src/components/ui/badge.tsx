type Props = {
  children: React.ReactNode;

  className?: string;
};

export function Badge({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`inline-flex rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-400 ${className}`}
    >
      {children}
    </div>
  );
}
