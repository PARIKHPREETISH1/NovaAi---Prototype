import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PersonaBadge } from "@/components/StatusBadge";
import { contacts, PERSONAS, personaMeta, Persona } from "@/lib/mock-data";
import { RefreshCw, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

export default function Contacts() {
  const [filter, setFilter] = useState<Persona | "ALL">("ALL");
  const [syncing, setSyncing] = useState(false);

  const filtered = filter === "ALL" ? contacts : contacts.filter((c) => c.persona === filter);
  const counts = PERSONAS.reduce((acc, p) => ({ ...acc, [p]: contacts.filter((c) => c.persona === p).length }), {} as Record<Persona, number>);

  const sync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSyncing(false);
    toast.success("Synced to HubSpot", { description: `${contacts.length} contacts queued · 0 conflicts` });
  };

  return (
    <AppLayout
      title="Contacts"
      subtitle="Audience synced with HubSpot"
      actions={
        <Button onClick={sync} disabled={syncing} className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5">
          {syncing ? <><Loader2 className="h-4 w-4 animate-spin" /> Syncing…</> : <><RefreshCw className="h-4 w-4" /> Sync to HubSpot</>}
        </Button>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 shadow-card border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /> Total contacts</div>
          <div className="mt-1.5 text-2xl font-semibold tabular-nums">{contacts.length.toLocaleString()}</div>
        </Card>
        {PERSONAS.map((p) => (
          <Card key={p} className="p-5 shadow-card border-border">
            <PersonaBadge persona={p} />
            <div className="mt-2 text-2xl font-semibold tabular-nums">{counts[p]}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{personaMeta[p].tagline}</div>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border overflow-hidden">
        <div className="flex items-center gap-1 p-3 border-b border-border bg-secondary/30">
          {(["ALL", ...PERSONAS] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "ALL" ? "All" : personaMeta[f].label}
              <span className="ml-1.5 text-muted-foreground/70">{f === "ALL" ? contacts.length : counts[f]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No contacts in this segment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/20 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">Name</th>
                  <th className="text-left font-medium px-3 py-2.5">Email</th>
                  <th className="text-left font-medium px-3 py-2.5">Persona</th>
                  <th className="text-left font-medium px-3 py-2.5">HubSpot</th>
                  <th className="text-left font-medium px-5 py-2.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-3 text-muted-foreground">{c.email}</td>
                    <td className="px-3"><PersonaBadge persona={c.persona} /></td>
                    <td className="px-3"><StatusBadge status={c.hubspot} /></td>
                    <td className="px-5 text-muted-foreground tabular-nums">{c.created}</td>
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
