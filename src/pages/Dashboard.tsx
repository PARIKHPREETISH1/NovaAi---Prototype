import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { CampaignTableSkeleton, KpiCardSkeleton } from "@/components/Skeletons";
import { listCampaigns, listTopicSuggestions, getAnalyticsSummary, personaMeta, Persona } from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { ArrowUpRight, Sparkles, TrendingUp, MailOpen, MousePointerClick, Trophy, Plus, Activity, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const personaAccent: Record<Persona, string> = {
  STRATEGIST: "text-strategist",
  BUILDER: "text-builder",
  EXPLORER: "text-explorer",
};

const personaBar: Record<Persona, string> = {
  STRATEGIST: "bg-strategist",
  BUILDER: "bg-builder",
  EXPLORER: "bg-explorer",
};

export default function Dashboard() {
  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: queryKeys.campaigns,
    queryFn: listCampaigns,
  });
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: queryKeys.analyticsSummary,
    queryFn: getAnalyticsSummary,
  });
  const { data: topics = [] } = useQuery({
    queryKey: queryKeys.topics,
    queryFn: listTopicSuggestions,
  });

  const kpis = summary
    ? [
        { label: "Campaigns shipped", value: String(summary.campaignsShipped30d), delta: "+3 last 30d", icon: TrendingUp, accent: "text-primary bg-primary-soft" },
        { label: "Open rate (30d avg)", value: `${summary.avgOpenRate}%`, delta: "▲ 2.1 pts WoW", icon: MailOpen, accent: "text-success bg-success-soft" },
        { label: "Click-through (30d)", value: `${summary.avgCtr}%`, delta: "▲ 0.6 pts WoW", icon: MousePointerClick, accent: "text-info bg-info-soft" },
        { label: "Top persona", value: personaMeta[summary.topPersona].label, delta: "51.2% open · 9.8% CTR", icon: Trophy, accent: "text-warning-foreground bg-warning-soft" },
      ]
    : [];

  return (
    <AppLayout
      title="Operations overview"
      subtitle="Weekly content pipeline · Marketing & Growth"
      actions={
        <Link to="/generate">
          <Button className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5">
            <Sparkles className="h-4 w-4" />
            New campaign
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loadingSummary
          ? [0, 1, 2, 3].map((i) => <KpiCardSkeleton key={i} />)
          : kpis.map((k) => (
              <Card key={k.label} className="p-4 shadow-card border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{k.value}</div>
                  </div>
                  <div className={`h-8 w-8 rounded-md grid place-items-center shrink-0 ${k.accent}`}>
                    <k.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2.5 text-[11px] text-muted-foreground">{k.delta}</div>
              </Card>
            ))}
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-0 shadow-card border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">Recent campaigns</h2>
              <p className="text-[11px] text-muted-foreground">Last 6 weekly drops · click to inspect</p>
            </div>
            <Link to="/campaigns" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {loadingCampaigns ? (
            <CampaignTableSkeleton />
          ) : (
            <div className="divide-y divide-border">
              {campaigns.slice(0, 5).map((c) => (
                <Link key={c.id} to={`/campaigns/${c.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.topic}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono">{c.id.toUpperCase()}</span>
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  {c.metrics ? (
                    <div className="hidden sm:flex items-center gap-5 text-xs text-muted-foreground tabular-nums">
                      <div><span className="text-foreground font-semibold">{c.metrics.openRate}%</span> <span className="text-[10px] uppercase">open</span></div>
                      <div><span className="text-foreground font-semibold">{c.metrics.ctr}%</span> <span className="text-[10px] uppercase">ctr</span></div>
                    </div>
                  ) : (
                    <div className="hidden sm:block text-[11px] text-muted-foreground italic">awaiting send</div>
                  )}
                  <StatusBadge status={c.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-0 shadow-card border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">Next-topic queue</h2>
              <p className="text-[11px] text-muted-foreground">Ranked by audience signal</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="divide-y divide-border">
            {topics.slice(0, 4).map((t) => (
              <div key={t.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium leading-snug">{t.topic}</div>
                  <span className="shrink-0 text-[10px] font-semibold text-primary bg-primary-soft px-1.5 py-0.5 rounded tabular-nums">
                    {t.confidence}%
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{t.rationale}</div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border bg-secondary/30">
            <Link to="/generate">
              <Button size="sm" variant="outline" className="w-full gap-1.5 h-8">
                <Plus className="h-3.5 w-3.5" /> Draft from suggestion
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-0 shadow-card border-border overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">Persona performance</h2>
              <p className="text-[11px] text-muted-foreground">30-day rolling · open rate & CTR</p>
            </div>
            <Link to="/analytics" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Open analytics <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {(summary?.personaPerformance ?? []).map((p) => (
              <div key={p.persona} className="flex items-center gap-4 px-5 py-3">
                <div className={`text-xs font-semibold uppercase tracking-wider w-24 ${personaAccent[p.persona]}`}>
                  {personaMeta[p.persona].label}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                      <span>Open rate</span>
                      <span className="text-foreground font-semibold tabular-nums">{p.openRate}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${personaBar[p.persona]}`} style={{ width: `${p.openRate}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                      <span>CTR</span>
                      <span className="text-foreground font-semibold tabular-nums">{p.ctr}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${personaBar[p.persona]}`} style={{ width: `${p.ctr * 8}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0 shadow-card border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">System status</h2>
              <p className="text-[11px] text-muted-foreground">Pipeline health · last 24h</p>
            </div>
            <Activity className="h-4 w-4 text-success" />
          </div>
          <ul className="divide-y divide-border text-xs">
            {[
              { label: "HubSpot sync", value: "Operational", tone: "success", sub: "4 min ago · 4,820 contacts" },
              { label: "Generation queue", value: "1 in draft", tone: "info", sub: "Next drop · Friday 09:00 UTC" },
              { label: "AI spend (30d)", value: "$184.21", tone: "neutral", sub: "Within $215 monthly cap" },
              { label: "Delivery rate (7d)", value: "99.6%", tone: "success", sub: "18 bounces · 4,802 delivered" },
            ].map((s) => (
              <li key={s.label} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</div>
                </div>
                <div className={`text-sm font-semibold tabular-nums shrink-0 ${
                  s.tone === "success" ? "text-success" : s.tone === "info" ? "text-info" : "text-foreground"
                }`}>
                  {s.value}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}
