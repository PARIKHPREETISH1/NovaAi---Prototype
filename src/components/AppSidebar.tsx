import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Sparkles, Send, Users, BarChart3, FolderKanban, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/generate", label: "Generate", icon: Sparkles },
  { to: "/campaigns", label: "Campaigns", icon: FolderKanban },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const loc = useLocation();
  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-elegant">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">NovaMind</div>
          <div className="text-[11px] text-sidebar-foreground/60">AI Content Pipeline</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-wider text-sidebar-foreground/40">Workspace</div>
        {nav.map((n) => {
          const active = n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white"
              )}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-md bg-sidebar-accent/60 p-3">
          <div className="text-xs font-medium text-white">HubSpot</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-sidebar-foreground/70">Connected · live sync</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 px-1">
          <div className="h-7 w-7 rounded-full bg-gradient-primary grid place-items-center text-[11px] font-semibold text-white">JR</div>
          <div className="leading-tight">
            <div className="text-xs font-medium text-white">Jordan R.</div>
            <div className="text-[10px] text-sidebar-foreground/60">Growth · Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
