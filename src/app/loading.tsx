import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";

export default function RootLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center transition-colors duration-200">
        <Container className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-emerald-500" />
          <p className="text-xs font-bold text-muted uppercase tracking-widest animate-pulse">
            Loading...
          </p>
        </Container>
      </main>
    </>
  );
}
