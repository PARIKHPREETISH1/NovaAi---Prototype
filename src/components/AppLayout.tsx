import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AppLayout({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10 flex items-center gap-4 px-4 md:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-lg font-semibold text-foreground truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
          <div className="hidden lg:flex items-center gap-2 w-72">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search campaigns, topics…" className="pl-8 h-9 bg-secondary/40 border-border" />
            </div>
          </div>
          <button className="h-9 w-9 grid place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary">
            <Bell className="h-4 w-4" />
          </button>
          {actions}
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
