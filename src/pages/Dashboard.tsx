import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { campaigns, topicSuggestions } from "@/lib/mock-data";
import { ArrowUpRight, Sparkles, TrendingUp, MailOpen, MousePointerClick, Trophy, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";

const kpis = [
  { label: "Total Campaigns", value: "47", delta: "+6 this month", icon: TrendingUp, accent: "text-primary bg-primary-soft" },
  { label: "Avg Open Rate", value: "43.2%", delta: "+2.1 pts vs last 30d", icon: MailOpen, accent: "text-success bg-success-soft" },
  { label: "Avg CTR", value: "8.07%", delta: "+0.6 pts vs last 30d", icon: MousePointerClick, accent: "text-info bg-info-soft" },
  { label: "Best Persona", value: "Strategist", delta: "51.2% open · 9.8% CTR", icon: Trophy, accent: "text-warning-foreground bg-warning-soft" },
];

export default function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Weekly content pipeline · Marketing & Growth"
      actions={
        <Link to="/generate">
          <Button className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5">
            <Sparkles className="h-4 w-4" />
            Quick Generate
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5 shadow-card border-border">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-muted-foreground">{k.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</div>
              </div>
              <div className={`h-9 w-9 rounded-md grid place-items-center ${k.accent}`}>
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">{k.delta}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-0 shadow-card border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">Recent campaigns</h2>
              <p className="text-xs text-muted-foreground">Last 6 weekly drops</p>
            </div>
            <Link to="/campaigns" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {campaigns.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/campaigns/${c.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.topic}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {c.id.toUpperCase()} · {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {c.metrics && (
                  <div className="hidden sm:flex items-center gap-5 text-xs text-muted-foreground">
                    <div><span className="text-foreground font-medium">{c.metrics.openRate}%</span> open</div>
                    <div><span className="text-foreground font-medium">{c.metrics.ctr}%</span> CTR</div>
                  </div>
                )}
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-0 shadow-card border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">AI topic suggestions</h2>
              <p className="text-xs text-muted-foreground">Ranked by audience signal</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="divide-y divide-border">
            {topicSuggestions.slice(0, 4).map((t) => (
              <div key={t.topic} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium leading-snug">{t.topic}</div>
                  <span className="shrink-0 text-[10px] font-semibold text-primary bg-primary-soft px-1.5 py-0.5 rounded">
                    {t.confidence}%
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{t.rationale}</div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border bg-secondary/30">
            <Link to="/generate">
              <Button size="sm" variant="outline" className="w-full gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Start from suggestion
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Pipeline this week", value: "1 campaign in draft", sub: "Next scheduled drop · Friday 09:00 UTC" },
          { label: "Contacts synced", value: "4,820 / 4,820", sub: "Last sync · 4 min ago" },
          { label: "AI cost (30d)", value: "$184.21", sub: "Within budget · $215 cap" },
        ].map((s) => (
          <Card key={s.label} className="p-4 shadow-card border-border">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1.5 text-sm font-semibold">{s.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{s.sub}</div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
