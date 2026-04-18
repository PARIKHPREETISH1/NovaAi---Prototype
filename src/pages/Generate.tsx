import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, PersonaBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { NewsletterCardSkeleton } from "@/components/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createCampaign,
  updateNewsletterStatus,
  regenerateNewsletter,
  sendCampaign,
  personaMeta,
  Persona,
  Campaign,
} from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { Sparkles, RefreshCw, Check, MessageSquare, Send, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const personaBorder: Record<Persona, string> = {
  STRATEGIST: "border-l-strategist",
  BUILDER: "border-l-builder",
  EXPLORER: "border-l-explorer",
};

export default function Generate() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [regenerating, setRegenerating] = useState<Persona | null>(null);

  const createMut = useMutation({
    mutationFn: () => createCampaign({ topic, context }),
    onSuccess: (c) => {
      setCampaign(c);
      qc.invalidateQueries({ queryKey: queryKeys.campaigns });
      toast.success("Draft ready", { description: "1 blog · 3 newsletter variants · awaiting review" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const approveMut = useMutation({
    mutationFn: (p: Persona) => updateNewsletterStatus(campaign!.id, p, "approved"),
    onSuccess: (c, p) => {
      setCampaign(c);
      qc.invalidateQueries({ queryKey: queryKeys.campaigns });
      toast.success(`${personaMeta[p].label} variant approved`);
    },
  });

  const regenMut = useMutation({
    mutationFn: (p: Persona) => regenerateNewsletter(campaign!.id, p),
    onMutate: (p) => setRegenerating(p),
    onSettled: () => setRegenerating(null),
    onSuccess: (c, p) => {
      setCampaign(c);
      toast.success(`${personaMeta[p].label} variant regenerated`);
    },
  });

  const sendMut = useMutation({
    mutationFn: () => sendCampaign(campaign!.id),
    onSuccess: (c) => {
      setCampaign(c);
      qc.invalidateQueries({ queryKey: queryKeys.campaigns });
      toast.success("Queued in HubSpot", { description: "4,820 contacts · delivery starting now" });
      navigate(`/campaigns/${c.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const generate = () => {
    if (!topic.trim()) return toast.error("Topic is required");
    setCampaign(null);
    createMut.mutate();
  };

  const variants = campaign?.newsletters ?? [];
  const approvedCount = variants.filter((v) => v.status === "approved").length;
  const allApproved = variants.length > 0 && approvedCount === variants.length;
  const loading = createMut.isPending;

  return (
    <AppLayout title="Generate campaign" subtitle="Topic in · weekly drop out">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 shadow-card border-border lg:sticky lg:top-24 self-start">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-md bg-primary-soft text-primary grid place-items-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Campaign brief</h2>
              <p className="text-[11px] text-muted-foreground">GPT-4 · brand model v3.2</p>
            </div>
          </div>

          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Topic</label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. AI-assisted client onboarding"
            className="mt-1.5"
            disabled={loading}
          />

          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-4 block">
            Context <span className="font-normal normal-case text-muted-foreground/70">(optional)</span>
          </label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Audience segment, key references, must-include data points…"
            className="mt-1.5 min-h-24 resize-none"
            disabled={loading}
          />

          <Button onClick={generate} disabled={loading} className="w-full mt-4 bg-gradient-primary hover:opacity-90 shadow-elegant">
            {loading ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Generating…</> : <><Sparkles className="h-4 w-4 mr-1.5" /> Generate</>}
          </Button>

          <div className="mt-4 pt-4 border-t border-border space-y-2 text-[11px] text-muted-foreground">
            <div className="flex justify-between"><span>Output</span><span className="text-foreground font-medium">1 blog + 3 variants</span></div>
            <div className="flex justify-between"><span>Avg time</span><span className="text-foreground font-medium">45–90s</span></div>
            <div className="flex justify-between"><span>Est. cost</span><span className="text-foreground font-medium">$1.84</span></div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-5">
          {loading && (
            <>
              <Card className="shadow-card border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-16" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <StatusBadge status="regenerating" />
                </div>
                <div className="p-5 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="pt-3 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              </Card>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">Newsletter variants</div>
                    <div className="text-[11px] text-muted-foreground">Tuning persona-specific copy…</div>
                  </div>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => <NewsletterCardSkeleton key={i} />)}
                </div>
              </div>
            </>
          )}

          {!loading && !campaign && (
            <EmptyState
              icon={FileText}
              title="No draft in progress"
              description="Enter a topic on the left to generate a blog draft and three persona-tuned newsletter variants. Output usually ready in 45–90s."
            />
          )}

          {campaign && !loading && (
            <>
              <Card className="shadow-card border-border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Blog draft · ~1,200 words · {campaign.id.toUpperCase()}</div>
                    <h2 className="text-base font-semibold mt-0.5 truncate">{campaign.blogTitle}</h2>
                  </div>
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Outline</div>
                  <ol className="space-y-1.5 mb-5">
                    {campaign.blogOutline.map((o, i) => (
                      <li key={o} className="flex gap-2.5 text-sm">
                        <span className="text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Body</div>
                  <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{campaign.blogDraft}</div>
                </div>
              </Card>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-semibold">Newsletter variants</h2>
                    <p className="text-[11px] text-muted-foreground">Approve each variant or request changes before send</p>
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    <span className="text-foreground font-semibold">{approvedCount}</span> / 3 approved
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {variants.map((v) => (
                    <Card key={v.persona} className={`shadow-card border-border overflow-hidden flex flex-col border-l-4 ${personaBorder[v.persona]}`}>
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <PersonaBadge persona={v.persona} />
                        <StatusBadge status={regenerating === v.persona ? "regenerating" : v.status} />
                      </div>
                      <div className="p-4 flex-1 space-y-3">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</div>
                          <div className="text-sm font-medium mt-0.5 leading-snug">{v.subject}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Body preview</div>
                          <div className="text-xs text-foreground/80 mt-1 whitespace-pre-line leading-relaxed line-clamp-[8]">{v.body}</div>
                        </div>
                        <div className="text-[10px] text-muted-foreground border-t border-border pt-2">
                          <span className="font-semibold uppercase tracking-wider">Tone · </span>
                          {personaMeta[v.persona].tone}
                        </div>
                      </div>
                      <div className="p-2.5 border-t border-border bg-secondary/30 flex gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-[11px] gap-1"
                          onClick={() => regenMut.mutate(v.persona)}
                          disabled={regenerating === v.persona || v.status === "approved"}
                          title="Regenerate"
                        >
                          {regenerating === v.persona ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-[11px] gap-1" disabled={v.status === "approved"} title="Suggest changes">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          className="flex-[1.4] h-8 text-[11px] gap-1 bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() => approveMut.mutate(v.persona)}
                          disabled={v.status === "approved" || approveMut.isPending}
                        >
                          {v.status === "approved" ? <CheckCircle2 className="h-3 w-3" /> : <><Check className="h-3 w-3" /> Approve</>}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="p-4 shadow-card border-border flex items-center justify-between gap-4 bg-gradient-subtle">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-10 w-10 rounded-md grid place-items-center shrink-0 ${
                    allApproved ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
                  }`}>
                    {allApproved ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-semibold tabular-nums">{approvedCount}/3</span>}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">
                      {allApproved ? "Ready to ship" : "Awaiting approval"}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {allApproved ? "4,820 contacts queued · 3 segments" : `Approve ${3 - approvedCount} more variant${3 - approvedCount === 1 ? "" : "s"} to enable send`}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => sendMut.mutate()}
                  disabled={!allApproved || sendMut.isPending}
                  className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5 shrink-0"
                >
                  {sendMut.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send via HubSpot</>}
                </Button>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
