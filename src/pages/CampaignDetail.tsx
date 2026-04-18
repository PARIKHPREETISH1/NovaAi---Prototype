import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PersonaBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { campaigns, personaMeta } from "@/lib/mock-data";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, MailOpen, MousePointerClick, Users, CheckCircle2, AlertCircle, Activity, Lightbulb } from "lucide-react";
import { format } from "date-fns";

export default function CampaignDetail() {
  const { id } = useParams();
  const c = campaigns.find((x) => x.id === id);

  if (!c) {
    return (
      <AppLayout title="Campaign not found">
        <EmptyState title="Campaign not found" description="It may have been deleted or the URL is incorrect." action={<Link to="/campaigns"><Button variant="outline" size="sm">Back to campaigns</Button></Link>} />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={c.topic}
      subtitle={`${c.id.toUpperCase()} · created ${format(new Date(c.createdAt), "MMM d, yyyy 'at' HH:mm")}`}
      actions={<Link to="/campaigns"><Button variant="outline" size="sm" className="gap-1.5"><ArrowLeft className="h-3.5 w-3.5" /> All campaigns</Button></Link>}
    >
      <Card className="p-5 shadow-card border-border mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={c.status} />
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {c.sentAt ? `Sent ${format(new Date(c.sentAt), "MMM d, HH:mm")}` : "Not yet sent"}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-semibold">{c.blogTitle}</h2>
          </div>
          {c.metrics && (
            <div className="flex gap-6">
              {[
                { label: "Sent", value: c.metrics.sent.toLocaleString(), icon: Users },
                { label: "Open rate", value: `${c.metrics.openRate}%`, icon: MailOpen },
                { label: "CTR", value: `${c.metrics.ctr}%`, icon: MousePointerClick },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                  <div className="text-lg font-semibold tabular-nums">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold">Blog draft</h3>
              <p className="text-xs text-muted-foreground">Long-form content distributed via newsletter</p>
            </div>
            <div className="p-5">
              <ol className="space-y-1.5 mb-5">
                {c.blogOutline.map((o, i) => (
                  <li key={o} className="flex gap-2.5 text-sm">
                    <span className="text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ol>
              <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{c.blogDraft}</div>
            </div>
          </Card>

          <div>
            <h3 className="text-sm font-semibold mb-3">Newsletter variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {c.newsletters.map((n) => (
                <Card key={n.persona} className="shadow-card border-border overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <PersonaBadge persona={n.persona} />
                    <StatusBadge status={n.status} />
                  </div>
                  <div className="p-4 flex-1 space-y-3">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</div>
                      <div className="text-sm font-medium mt-0.5">{n.subject}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Body</div>
                      <div className="text-xs text-foreground/80 mt-1 whitespace-pre-line leading-relaxed line-clamp-[10]">{n.body}</div>
                    </div>
                  </div>
                  {c.metrics && (
                    <div className="px-4 py-3 border-t border-border bg-secondary/30 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Open</div>
                        <div className="font-semibold tabular-nums">{c.metrics.byPersona[n.persona].openRate}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-muted-foreground tracking-wider">CTR</div>
                        <div className="font-semibold tabular-nums">{c.metrics.byPersona[n.persona].ctr}%</div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {c.insights && (
            <Card className="shadow-card border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-primary-soft text-primary grid place-items-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">AI insights</h3>
                  <p className="text-xs text-muted-foreground">Generated from this campaign's performance</p>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {c.insights.map((ins, i) => (
                  <li key={i} className="px-5 py-3.5 flex gap-3 text-sm">
                    <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{ins}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-card border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-sm font-semibold">HubSpot activity</h3>
                <p className="text-xs text-muted-foreground">Live integration log</p>
              </div>
            </div>
            {c.hubspotLog ? (
              <ol className="p-5 space-y-3">
                {c.hubspotLog.map((l, i) => (
                  <li key={i} className="flex gap-3 text-xs">
                    <div className="tabular-nums text-muted-foreground w-16 shrink-0">{l.ts}</div>
                    <div className="mt-0.5 shrink-0">
                      {l.status === "ok" && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                      {l.status === "warn" && <AlertCircle className="h-3.5 w-3.5 text-warning" />}
                      {l.status === "err" && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                    </div>
                    <div className="text-foreground/90 leading-relaxed">{l.event}</div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">No activity yet · campaign has not been sent.</div>
            )}
          </Card>

          <Card className="p-4 shadow-card border-border bg-gradient-subtle">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Best-performing persona</div>
            {c.metrics ? (
              <>
                <div className="mt-1.5 text-base font-semibold">Strategist</div>
                <div className="text-xs text-muted-foreground mt-0.5">{personaMeta.STRATEGIST.tagline}</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-muted-foreground">Open</div>
                    <div className="font-semibold tabular-nums">{c.metrics.byPersona.STRATEGIST.openRate}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">CTR</div>
                    <div className="font-semibold tabular-nums">{c.metrics.byPersona.STRATEGIST.ctr}%</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-2 text-xs text-muted-foreground">Metrics available after send.</div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
