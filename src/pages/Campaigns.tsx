import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { CampaignTableSkeleton } from "@/components/Skeletons";
import { listCampaigns } from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { Search, Sparkles, ArrowUpRight, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Campaigns() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: queryKeys.campaigns,
    queryFn: listCampaigns,
  });

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
      title="Campaign log"
      subtitle="Weekly content pipeline · sortable, searchable history"
      actions={
        <Link to="/generate">
          <Button className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5">
            <Sparkles className="h-4 w-4" /> New campaign
          </Button>
        </Link>
      }
    >
      <Card className="shadow-card border-border overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 border-b border-border bg-secondary/20">
          <div className="flex items-center gap-1 bg-card border border-border rounded-md p-0.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setStatus(t.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  status === t.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label} <span className="text-muted-foreground/70 ml-1 tabular-nums">{t.count}</span>
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topic or campaign ID…" className="pl-8 h-9" />
          </div>
        </div>

        {isLoading ? (
          <CampaignTableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={FileSearch}
              title="No campaigns match"
              description={q ? `Nothing matches "${q}". Try a different topic or campaign ID.` : "No campaigns in this status bucket. Create a new one to fill the pipeline."}
              action={
                <Link to="/generate">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Start a campaign
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-5 py-2.5">Campaign</th>
                  <th className="text-left font-semibold px-3 py-2.5">Status</th>
                  <th className="text-left font-semibold px-3 py-2.5">Created</th>
                  <th className="text-right font-semibold px-3 py-2.5">Recipients</th>
                  <th className="text-right font-semibold px-3 py-2.5">Open</th>
                  <th className="text-right font-semibold px-3 py-2.5">CTR</th>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={`/campaigns/${c.id}`} className="font-medium hover:text-primary">{c.topic}</Link>
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">{c.id.toUpperCase()}</div>
                    </td>
                    <td className="px-3"><StatusBadge status={c.status} /></td>
                    <td className="px-3 text-muted-foreground text-xs tabular-nums">{format(new Date(c.createdAt), "MMM d, yyyy")}</td>
                    <td className="px-3 text-right tabular-nums text-xs">{c.metrics?.sent.toLocaleString() ?? <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-3 text-right tabular-nums text-xs">
                      {c.metrics ? <span className="font-medium">{c.metrics.openRate}%</span> : <span className="text-muted-foreground italic">pending</span>}
                    </td>
                    <td className="px-3 text-right tabular-nums text-xs">
                      {c.metrics ? <span className="font-medium">{c.metrics.ctr}%</span> : <span className="text-muted-foreground italic">pending</span>}
                    </td>
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
