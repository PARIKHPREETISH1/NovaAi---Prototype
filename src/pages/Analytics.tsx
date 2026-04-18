import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartSkeleton, KpiCardSkeleton } from "@/components/Skeletons";
import { getAnalyticsSummary, listTopicSuggestions, personaMeta, Persona } from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles, Lightbulb, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const personaColors: Record<Persona, string> = {
  STRATEGIST: "hsl(var(--persona-strategist))",
  BUILDER: "hsl(var(--persona-builder))",
  EXPLORER: "hsl(var(--persona-explorer))",
};

export default function Analytics() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: queryKeys.analyticsSummary,
    queryFn: getAnalyticsSummary,
  });
  const { data: topics = [], isLoading: loadingTopics } = useQuery({
    queryKey: queryKeys.topics,
    queryFn: listTopicSuggestions,
  });

  const kpis = summary
    ? [
        { label: "Campaigns shipped (30d)", value: String(summary.campaignsShipped30d), delta: "+3 vs prior period", trend: "up" as const },
        { label: "Avg open rate", value: `${summary.avgOpenRate}%`, delta: "+2.1 pts", trend: "up" as const },
        { label: "Avg CTR", value: `${summary.avgCtr}%`, delta: "+0.6 pts", trend: "up" as const },
        { label: "Top persona", value: personaMeta[summary.topPersona].label, delta: "51.2% / 9.8%", trend: "flat" as const },
      ]
    : [];

  const personaChartData = summary?.personaPerformance.map((p) => ({
    persona: personaMeta[p.persona].label,
    personaKey: p.persona,
    openRate: p.openRate,
    ctr: p.ctr,
  })) ?? [];

  return (
    <AppLayout title="Analytics" subtitle="Performance across personas, topics, and time">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {loadingSummary
          ? [0, 1, 2, 3].map((i) => <KpiCardSkeleton key={i} />)
          : kpis.map((s) => (
              <Card key={s.label} className="p-4 shadow-card border-border">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">{s.value}</div>
                <div className={`text-[11px] mt-1 inline-flex items-center gap-0.5 ${
                  s.trend === "up" ? "text-success" : "text-muted-foreground"
                }`}>
                  {s.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                  {s.delta}
                </div>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        <Card className="lg:col-span-3 shadow-card border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Persona performance</h3>
                <p className="text-[11px] text-muted-foreground">Last 30 days · open rate vs CTR</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary" /> Open</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-info" /> CTR</span>
              </div>
            </div>
          </div>
          <div className="p-4 h-72">
            {loadingSummary ? (
              <ChartSkeleton height={240} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={personaChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="persona" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: "hsl(var(--secondary))", opacity: 0.4 }}
                  />
                  <Bar dataKey="openRate" name="Open rate %" radius={[4, 4, 0, 0]}>
                    {personaChartData.map((p) => (
                      <Cell key={p.personaKey} fill={personaColors[p.personaKey as Persona]} />
                    ))}
                  </Bar>
                  <Bar dataKey="ctr" name="CTR %" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} opacity={0.55} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2 shadow-card border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Trend · 7 weeks</h3>
              <p className="text-[11px] text-muted-foreground">Weekly campaign performance</p>
            </div>
            <div className="text-success inline-flex items-center gap-1 text-[11px]">
              <TrendingUp className="h-3 w-3" /> +5.0 pts
            </div>
          </div>
          <div className="p-4 h-72">
            {loadingSummary ? (
              <ChartSkeleton height={240} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary?.trend ?? []} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="openRate" name="Open %" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ctr" name="CTR %" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="shadow-card border-border overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
            <div className="h-7 w-7 rounded-md bg-primary-soft text-primary grid place-items-center">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">AI insights</h3>
              <p className="text-[11px] text-muted-foreground">Generated from last 30 days of campaign data</p>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {(summary?.insights ?? []).map((ins) => (
              <li key={ins.id} className="px-5 py-3 flex gap-3 text-sm">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  ins.tone === "win" ? "bg-success" : ins.tone === "warn" ? "bg-warning" : "bg-info"
                }`} />
                <span className="text-foreground/90 leading-relaxed">{ins.text}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="shadow-card border-border overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
            <div className="h-7 w-7 rounded-md bg-warning-soft text-warning-foreground grid place-items-center">
              <Lightbulb className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Next-topic queue</h3>
              <p className="text-[11px] text-muted-foreground">Ranked by predicted engagement</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {loadingTopics ? (
              <div className="p-5 text-xs text-muted-foreground">Loading suggestions…</div>
            ) : (
              topics.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-snug">{t.topic}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{t.rationale}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold text-primary bg-primary-soft px-1.5 py-0.5 rounded tabular-nums">{t.confidence}%</span>
                    <Link to="/generate">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] gap-1">
                        <Plus className="h-3 w-3" /> Use
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
