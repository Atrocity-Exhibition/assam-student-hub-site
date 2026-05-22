type Props = {
  children: React.ReactNode;

  className?: string;
};

export function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-3xl border border-border bg-card/50 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
