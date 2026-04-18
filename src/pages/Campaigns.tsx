import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { campaigns } from "@/lib/mock-data";
import { Search, Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Campaigns() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = campaigns.filter(
    (c) =>
      (status === "all" || c.status === status) &&
      (!q || c.topic.toLowerCase().includes(q.toLowerCase()) || c.id.includes(q))
  );

  const tabs = [
    { id: "all", label: "All", count: campaigns.length },
    { id: "sent", label: "Sent", count: campaigns.filter((c) => c.status === "sent").length },
    { id: "approved", label: "Approved", count: campaigns.filter((c) => c.status === "approved").length },
    { id: "draft", label: "Draft", count: campaigns.filter((c) => c.status === "draft").length },
  ];

  return (
    <AppLayout
      title="Campaigns"
      subtitle="Weekly content history"
      actions={
        <Link to="/generate">
          <Button className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5">
            <Sparkles className="h-4 w-4" /> New campaign
          </Button>
        </Link>
      }
    >
      <Card className="shadow-card border-border overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-border">
          <div className="flex items-center gap-1 bg-secondary/40 rounded-md p-0.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setStatus(t.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  status === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label} <span className="text-muted-foreground/70 ml-1">{t.count}</span>
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topic or ID…" className="pl-8 h-9" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No campaigns match these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">Campaign</th>
                  <th className="text-left font-medium px-3 py-2.5">Status</th>
                  <th className="text-left font-medium px-3 py-2.5">Created</th>
                  <th className="text-right font-medium px-3 py-2.5">Sent</th>
                  <th className="text-right font-medium px-3 py-2.5">Open rate</th>
                  <th className="text-right font-medium px-3 py-2.5">CTR</th>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/campaigns/${c.id}`} className="font-medium hover:text-primary">{c.topic}</Link>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{c.id.toUpperCase()}</div>
                    </td>
                    <td className="px-3"><StatusBadge status={c.status} /></td>
                    <td className="px-3 text-muted-foreground">{format(new Date(c.createdAt), "MMM d, yyyy")}</td>
                    <td className="px-3 text-right tabular-nums">{c.metrics?.sent.toLocaleString() ?? "—"}</td>
                    <td className="px-3 text-right tabular-nums">{c.metrics ? `${c.metrics.openRate}%` : "—"}</td>
                    <td className="px-3 text-right tabular-nums">{c.metrics ? `${c.metrics.ctr}%` : "—"}</td>
                    <td className="px-5 text-right">
                      <Link to={`/campaigns/${c.id}`} className="text-muted-foreground hover:text-primary inline-flex">
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </td>
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
