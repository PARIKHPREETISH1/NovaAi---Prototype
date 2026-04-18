import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PersonaBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { contacts, PERSONAS, personaMeta, Persona } from "@/lib/mock-data";
import { RefreshCw, Loader2, Users, UserX } from "lucide-react";
import { toast } from "sonner";

const personaText: Record<Persona, string> = {
  STRATEGIST: "text-strategist",
  BUILDER: "text-builder",
  EXPLORER: "text-explorer",
};

export default function Contacts() {
  const [filter, setFilter] = useState<Persona | "ALL">("ALL");
  const [syncing, setSyncing] = useState(false);

  const filtered = filter === "ALL" ? contacts : contacts.filter((c) => c.persona === filter);
  const counts = PERSONAS.reduce((acc, p) => ({ ...acc, [p]: contacts.filter((c) => c.persona === p).length }), {} as Record<Persona, number>);
  const syncedCount = contacts.filter((c) => c.hubspot === "synced").length;

  const sync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSyncing(false);
    toast.success("Synced to HubSpot", { description: `${contacts.length} contacts pushed · 0 conflicts` });
  };

  return (
    <AppLayout
      title="Audience"
      subtitle={`${contacts.length.toLocaleString()} contacts · synced with HubSpot`}
      actions={
        <Button onClick={sync} disabled={syncing} className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5">
          {syncing ? <><Loader2 className="h-4 w-4 animate-spin" /> Syncing…</> : <><RefreshCw className="h-4 w-4" /> Sync to HubSpot</>}
        </Button>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 shadow-card border-border">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Users className="h-3 w-3" /> Total
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">{contacts.length.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            <span className="text-success font-medium tabular-nums">{syncedCount}</span> synced ·{" "}
            <span className="text-warning-foreground tabular-nums">{contacts.length - syncedCount}</span> pending
          </div>
        </Card>
        {PERSONAS.map((p) => (
          <Card key={p} className="p-4 shadow-card border-border border-l-4" style={{ borderLeftColor: `hsl(var(--persona-${p.toLowerCase()}))` }}>
            <PersonaBadge persona={p} />
            <div className={`mt-2 text-2xl font-semibold tabular-nums ${personaText[p]}`}>{counts[p]}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{personaMeta[p].tagline}</div>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border overflow-hidden">
        <div className="flex items-center gap-1 p-2.5 border-b border-border bg-secondary/20">
          {(["ALL", ...PERSONAS] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                filter === f ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "ALL" ? "All" : personaMeta[f].label}
              <span className="ml-1.5 text-muted-foreground/70 tabular-nums">{f === "ALL" ? contacts.length : counts[f]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={UserX} title="No contacts in this segment" description="Adjust your filter or sync new contacts from HubSpot." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-5 py-2.5">Name</th>
                  <th className="text-left font-semibold px-3 py-2.5">Email</th>
                  <th className="text-left font-semibold px-3 py-2.5">Persona</th>
                  <th className="text-left font-semibold px-3 py-2.5">HubSpot sync</th>
                  <th className="text-left font-semibold px-5 py-2.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-2.5 font-medium">{c.name}</td>
                    <td className="px-3 text-muted-foreground text-xs">{c.email}</td>
                    <td className="px-3"><PersonaBadge persona={c.persona} /></td>
                    <td className="px-3"><StatusBadge status={c.hubspot} /></td>
                    <td className="px-5 text-muted-foreground tabular-nums text-xs">{c.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
