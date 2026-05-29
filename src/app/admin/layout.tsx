import { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Shield } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Topbar */}
      <div className="sticky top-0 z-50 border-b border-border bg-card/60 backdrop-blur-xl">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold tracking-tight text-foreground">
                Admin Control Center
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              System Live
            </div>
          </div>
        </Container>
      </div>

      <main className="py-12">{children}</main>
    </div>
  );
}
