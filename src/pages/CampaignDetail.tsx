import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PersonaBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { CampaignTableSkeleton } from "@/components/Skeletons";
import { getCampaign, getCampaignAnalytics, personaMeta, Persona } from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, MailOpen, MousePointerClick, Users, CheckCircle2, AlertCircle, Activity, Lightbulb, Inbox } from "lucide-react";
import { format } from "date-fns";

const personaBorder: Record<Persona, string> = {
  STRATEGIST: "border-l-strategist",
  BUILDER: "border-l-builder",
  EXPLORER: "border-l-explorer",
};

const personaText: Record<Persona, string> = {
  STRATEGIST: "text-strategist",
  BUILDER: "text-builder",
  EXPLORER: "text-explorer",
};

export default function CampaignDetail() {
  const { id = "" } = useParams();
  const { data: c, isLoading, isError } = useQuery({
    queryKey: queryKeys.campaign(id),
    queryFn: () => getCampaign(id),
    enabled: !!id,
  });
  const { data: analytics } = useQuery({
    queryKey: queryKeys.campaignAnalytics(id),
    queryFn: () => getCampaignAnalytics(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppLayout title="Loading campaign…">
        <Card className="shadow-card border-border">
          <CampaignTableSkeleton />
        </Card>
      </AppLayout>
    );
  }

  if (isError || !c) {
    return (
      <AppLayout title="Campaign not found">
        <EmptyState
          title="Campaign not found"
          description="It may have been deleted or the URL is incorrect."
          action={<Link to="/campaigns"><Button variant="outline" size="sm">Back to campaign log</Button></Link>}
        />
      </AppLayout>
    );
  }

  const metrics = analytics?.metrics ?? c.metrics;
  const insights = analytics?.insights ?? c.insights;

  const bestPersona = metrics
    ? (Object.entries(metrics.byPersona).sort((a, b) => b[1].openRate - a[1].openRate)[0][0] as Persona)
    : null;

  return (
    <AppLayout
      title={c.topic}
      subtitle={`${c.id.toUpperCase()} · created ${format(new Date(c.createdAt), "MMM d, yyyy 'at' HH:mm")}`}
      actions={<Link to="/campaigns"><Button variant="outline" size="sm" className="gap-1.5"><ArrowLeft className="h-3.5 w-3.5" /> Campaign log</Button></Link>}
    >
      <Card className="p-5 shadow-card border-border mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={c.status} />
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] text-muted-foreground">
                {c.sentAt ? `Sent ${format(new Date(c.sentAt), "MMM d, HH:mm 'UTC'")}` : "Not sent"}
              </span>
              {!metrics && c.status === "sent" && <StatusBadge status="pending_metrics" />}
            </div>
            <h2 className="mt-2 text-lg font-semibold leading-tight">{c.blogTitle}</h2>
          </div>
          {metrics ? (
            <div className="grid grid-cols-3 gap-5 md:gap-8">
              {[
                { label: "Recipients", value: metrics.sent.toLocaleString(), icon: Users },
                { label: "Open rate", value: `${metrics.openRate}%`, icon: MailOpen },
                { label: "CTR", value: `${metrics.ctr}%`, icon: MousePointerClick },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <m.icon className="h-3 w-3" /> {m.label}
                  </div>
                  <div className="text-xl font-semibold tabular-nums mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground italic">
              Metrics populate ~2h after first send
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="shadow-card border-border overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Blog draft</h3>
                <p className="text-[11px] text-muted-foreground">Long-form · distributed via newsletter</p>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">{c.blogDraft.split(" ").length} words</span>
            </div>
            <div className="p-5">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Outline</div>
              <ol className="space-y-1.5 mb-5">
                {c.blogOutline.map((o, i) => (
                  <li key={o} className="flex gap-2.5 text-sm">
                    <span className="text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ol>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Body</div>
              <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{c.blogDraft}</div>
            </div>
          </Card>

          <div>
            <h3 className="text-sm font-semibold mb-3">Newsletter variants <span className="text-muted-foreground font-normal">· 3 segments</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {c.newsletters.map((n) => (
                <Card key={n.persona} className={`shadow-card border-border overflow-hidden flex flex-col border-l-4 ${personaBorder[n.persona]}`}>
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <PersonaBadge persona={n.persona} />
                    <StatusBadge status={n.status} />
                  </div>
                  <div className="p-4 flex-1 space-y-3">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</div>
                      <div className="text-sm font-medium mt-0.5 leading-snug">{n.subject}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Body</div>
                      <div className="text-xs text-foreground/80 mt-1 whitespace-pre-line leading-relaxed line-clamp-[8]">{n.body}</div>
                    </div>
                  </div>
                  {metrics ? (
                    <div className="px-4 py-3 border-t border-border bg-secondary/30 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-[9px] uppercase text-muted-foreground tracking-wider">Sent</div>
                        <div className="font-semibold tabular-nums text-[11px]">{metrics.byPersona[n.persona].sent.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase text-muted-foreground tracking-wider">Open</div>
                        <div className="font-semibold tabular-nums text-[11px]">{metrics.byPersona[n.persona].openRate}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase text-muted-foreground tracking-wider">CTR</div>
                        <div className="font-semibold tabular-nums text-[11px]">{metrics.byPersona[n.persona].ctr}%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 border-t border-border bg-secondary/30 text-[10px] text-muted-foreground italic">
                      Metrics pending send
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {insights && insights.length > 0 ? (
            <Card className="shadow-card border-border overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-primary-soft text-primary grid place-items-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">AI insights</h3>
                  <p className="text-[11px] text-muted-foreground">Auto-generated from this campaign's signals</p>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {insights.map((ins) => (
                  <li key={ins.id} className="px-5 py-3 flex gap-3 text-sm">
                    <Lightbulb className={`h-4 w-4 shrink-0 mt-0.5 ${
                      ins.tone === "win" ? "text-success" : ins.tone === "warn" ? "text-warning" : "text-info"
                    }`} />
                    <span className="text-foreground/90 leading-relaxed">{ins.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="Insights pending"
              description="AI insights are generated from delivery, open, and click data. They appear ~2 hours after first send."
            />
          )}
        </div>

        <div className="space-y-5">
          <Card className="shadow-card border-border overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold">HubSpot event log</h3>
                <p className="text-[11px] text-muted-foreground">Live integration trace</p>
              </div>
              {c.hubspotLog && (
                <span className="text-[10px] text-muted-foreground font-mono tabular-nums">{c.hubspotLog.length} events</span>
              )}
            </div>
            {c.hubspotLog ? (
              <ol className="font-mono text-[11px]">
                {c.hubspotLog.map((l, i) => (
                  <li key={i} className="px-5 py-2.5 flex gap-3 hover:bg-secondary/30 border-b border-border last:border-0">
                    <div className="tabular-nums text-muted-foreground w-16 shrink-0">{l.ts}</div>
                    <div className="shrink-0 mt-0.5">
                      {l.status === "ok" && <CheckCircle2 className="h-3 w-3 text-success" />}
                      {l.status === "warn" && <AlertCircle className="h-3 w-3 text-warning" />}
                      {l.status === "err" && <AlertCircle className="h-3 w-3 text-destructive" />}
                    </div>
                    <div className="text-foreground/90 leading-relaxed font-sans">{l.event}</div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="p-8 text-center">
                <div className="h-9 w-9 mx-auto rounded-full bg-secondary grid place-items-center mb-2">
                  <Inbox className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xs font-medium">No events yet</div>
                <div className="text-[11px] text-muted-foreground mt-1">Campaign has not been sent.</div>
              </div>
            )}
          </Card>

          <Card className="p-4 shadow-card border-border bg-gradient-subtle">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Top-performing persona</div>
            {metrics && bestPersona ? (
              <>
                <div className={`mt-1.5 text-base font-semibold ${personaText[bestPersona]}`}>{personaMeta[bestPersona].label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{personaMeta[bestPersona].tagline}</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Open</div>
                    <div className="font-semibold tabular-nums text-sm">{metrics.byPersona[bestPersona].openRate}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">CTR</div>
                    <div className="font-semibold tabular-nums text-sm">{metrics.byPersona[bestPersona].ctr}%</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-2 text-xs text-muted-foreground italic">Available after send.</div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
