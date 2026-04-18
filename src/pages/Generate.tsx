import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, PersonaBadge, PersonaAccentBar } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { NewsletterCardSkeleton } from "@/components/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { PERSONAS, personaMeta, NewsletterVariant, Persona } from "@/lib/mock-data";
import { Sparkles, RefreshCw, Check, MessageSquare, Send, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const buildDraft = (topic: string) => ({
  title: `${topic}: A Practical Playbook for Modern Creative Teams`,
  outline: [
    "Why this matters now for small creative agencies",
    "The 3-step automation framework",
    "Tooling stack and integration patterns",
    "Measuring ROI in the first 30 days",
    "Common pitfalls and how to avoid them",
  ],
  body: `Creative agencies are under pressure to ship more, faster, without diluting craft. ${topic} is the wedge that lets a 6-person team punch like a 20-person studio.\n\nIn this piece, we walk through the operating model NovaMind clients use to compress production cycles by 40%. Three pillars: capture, structure, distribute. Capture turns every client touchpoint into structured input. Structure lets AI handle the first 60% of the draft. Distribute meets each persona where they read.\n\nBy the end of this guide, you will have a concrete checklist your team can run on Monday.`,
});

const buildVariants = (topic: string): NewsletterVariant[] =>
  PERSONAS.map((p) => {
    const map: Record<Persona, { subject: string; body: string }> = {
      STRATEGIST: {
        subject: `${topic}: the 40% margin lever your competitors missed`,
        body: `Hi {first_name},\n\nIf you're benchmarking automation investment this quarter, here is the one-page summary your CFO will actually read.\n\nClients who deployed this playbook saw a 32% lift in qualified pipeline within 60 days, with payback under one cycle.\n\n— The NovaMind team`,
      },
      BUILDER: {
        subject: `Ship ${topic} this sprint — here's the exact stack`,
        body: `Hey {first_name},\n\nWe wrote up the implementation we wish we'd had a year ago. Stack, env vars, gotchas, and a Loom of the whole thing.\n\nEstimated time to first working version: 90 minutes.`,
      },
      EXPLORER: {
        subject: `okay this ${topic} thing is actually wild 👀`,
        body: `hey {first_name} —\n\nspent saturday playing with this and it changed how I pitch. closed two retainers monday off one demo.\n\nlinking the breakdown + the exact prompts.`,
      },
    };
    return { persona: p, subject: map[p].subject, preview: map[p].body.slice(0, 60) + "…", body: map[p].body, status: "pending" };
  });

const personaBorder: Record<Persona, string> = {
  STRATEGIST: "border-l-strategist",
  BUILDER: "border-l-builder",
  EXPLORER: "border-l-explorer",
};

export default function Generate() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<ReturnType<typeof buildDraft> | null>(null);
  const [variants, setVariants] = useState<NewsletterVariant[]>([]);
  const [regenerating, setRegenerating] = useState<Persona | null>(null);
  const [sending, setSending] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return toast.error("Topic is required");
    setLoading(true);
    setDraft(null);
    setVariants([]);
    await new Promise((r) => setTimeout(r, 1600));
    setDraft(buildDraft(topic));
    setVariants(buildVariants(topic));
    setLoading(false);
    toast.success("Draft ready", { description: "1 blog · 3 newsletter variants · awaiting review" });
  };

  const approve = (p: Persona) => {
    setVariants((v) => v.map((x) => (x.persona === p ? { ...x, status: "approved" } : x)));
    toast.success(`${personaMeta[p].label} variant approved`);
  };

  const regenerate = async (p: Persona) => {
    setRegenerating(p);
    setVariants((v) => v.map((x) => (x.persona === p ? { ...x, status: "regenerating" } : x)));
    await new Promise((r) => setTimeout(r, 1200));
    setVariants((v) => v.map((x) => (x.persona === p ? { ...x, status: "pending", subject: x.subject + " · v2" } : x)));
    setRegenerating(null);
    toast.success(`${personaMeta[p].label} variant regenerated`);
  };

  const send = async () => {
    if (variants.some((v) => v.status !== "approved")) return toast.error("Approve all 3 variants before sending");
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    toast.success("Queued in HubSpot", { description: "4,820 contacts · delivery starting now" });
  };

  const allApproved = variants.length > 0 && variants.every((v) => v.status === "approved");
  const approvedCount = variants.filter((v) => v.status === "approved").length;

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

          {!loading && !draft && (
            <EmptyState
              icon={FileText}
              title="No draft in progress"
              description="Enter a topic on the left to generate a blog draft and three persona-tuned newsletter variants. Output usually ready in 45–90s."
            />
          )}

          {draft && !loading && (
            <>
              <Card className="shadow-card border-border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Blog draft · ~1,200 words</div>
                    <h2 className="text-base font-semibold mt-0.5 truncate">{draft.title}</h2>
                  </div>
                  <StatusBadge status="draft" />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Outline</div>
                  <ol className="space-y-1.5 mb-5">
                    {draft.outline.map((o, i) => (
                      <li key={o} className="flex gap-2.5 text-sm">
                        <span className="text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Body</div>
                  <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{draft.body}</div>
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
                        <StatusBadge status={v.status} />
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
                          onClick={() => regenerate(v.persona)}
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
                          onClick={() => approve(v.persona)}
                          disabled={v.status === "approved"}
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
                  onClick={send}
                  disabled={!allApproved || sending}
                  className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5 shrink-0"
                >
                  {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send via HubSpot</>}
                </Button>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
