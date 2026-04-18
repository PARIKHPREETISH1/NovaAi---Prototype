import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, PersonaBadge } from "@/components/StatusBadge";
import { PERSONAS, personaMeta, NewsletterVariant, Persona } from "@/lib/mock-data";
import { Sparkles, RefreshCw, Check, MessageSquare, Send, Loader2, FileText } from "lucide-react";
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
    toast.success("Draft generated", { description: "1 blog · 3 newsletter variants" });
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
    toast.success("Campaign sent via HubSpot", { description: "4,820 contacts queued for delivery" });
  };

  const allApproved = variants.length > 0 && variants.every((v) => v.status === "approved");

  return (
    <AppLayout title="Generate campaign" subtitle="Topic in · weekly campaign out">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 shadow-card border-border lg:sticky lg:top-24 self-start">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-md bg-primary-soft text-primary grid place-items-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">New campaign brief</h2>
              <p className="text-xs text-muted-foreground">GPT-4 · NovaMind brand model v3.2</p>
            </div>
          </div>

          <label className="text-xs font-medium text-foreground">Campaign topic</label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. AI-assisted client onboarding"
            className="mt-1.5"
            disabled={loading}
          />

          <label className="text-xs font-medium text-foreground mt-4 block">Additional context <span className="text-muted-foreground font-normal">(optional)</span></label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Audience segment, key references, must-include data points…"
            className="mt-1.5 min-h-24 resize-none"
            disabled={loading}
          />

          <Button onClick={generate} disabled={loading} className="w-full mt-4 bg-gradient-primary hover:opacity-90 shadow-elegant">
            {loading ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Generating…</> : <><Sparkles className="h-4 w-4 mr-1.5" /> Generate campaign</>}
          </Button>

          <div className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
            Output: 1 blog draft (~1,200 words), 3 persona-tuned newsletter variants. Avg generation time: 45–90s.
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <Card className="p-10 shadow-card border-border">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-primary-soft grid place-items-center">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                </div>
                <div className="mt-4 text-sm font-medium">Drafting your campaign</div>
                <div className="text-xs text-muted-foreground mt-1">Outlining blog · drafting body · tuning 3 persona variants</div>
                <div className="mt-5 w-full max-w-xs space-y-1.5">
                  {["Outline", "Blog body", "Strategist variant", "Builder variant", "Explorer variant"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <div className={`h-1.5 flex-1 rounded-full bg-secondary overflow-hidden`}>
                        <div className="h-full bg-gradient-primary animate-pulse" style={{ width: `${100 - i * 18}%` }} />
                      </div>
                      <span className="w-20 text-left">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {!loading && !draft && (
            <Card className="p-12 shadow-card border-border border-dashed">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto rounded-full bg-secondary grid place-items-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-3 text-sm font-medium">No draft yet</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Enter a topic on the left to generate a blog draft and three persona-specific newsletter variants.
                </div>
              </div>
            </Card>
          )}

          {draft && (
            <>
              <Card className="shadow-card border-border overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Blog draft</div>
                    <h2 className="text-base font-semibold mt-0.5">{draft.title}</h2>
                  </div>
                  <StatusBadge status="draft" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Outline</div>
                  <ol className="space-y-1.5 mb-5">
                    {draft.outline.map((o, i) => (
                      <li key={o} className="flex gap-2.5 text-sm">
                        <span className="text-muted-foreground tabular-nums w-5">{i + 1}.</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Body</div>
                  <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{draft.body}</div>
                </div>
              </Card>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-semibold">Newsletter variants</h2>
                    <p className="text-xs text-muted-foreground">Approve each variant or request changes</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {variants.filter((v) => v.status === "approved").length} of 3 approved
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {variants.map((v) => (
                    <Card key={v.persona} className="shadow-card border-border overflow-hidden flex flex-col">
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <PersonaBadge persona={v.persona} />
                        <StatusBadge status={v.status} />
                      </div>
                      <div className="p-4 flex-1 space-y-3">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</div>
                          <div className="text-sm font-medium mt-0.5">{v.subject}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Body</div>
                          <div className="text-xs text-foreground/80 mt-1 whitespace-pre-line leading-relaxed line-clamp-[10]">{v.body}</div>
                        </div>
                        <div className="text-[10px] text-muted-foreground italic">Tone: {personaMeta[v.persona].tone}</div>
                      </div>
                      <div className="p-3 border-t border-border bg-secondary/30 flex gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8"
                          onClick={() => regenerate(v.persona)}
                          disabled={regenerating === v.persona || v.status === "approved"}
                        >
                          {regenerating === v.persona ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8" disabled={v.status === "approved"}>
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 h-8 bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() => approve(v.persona)}
                          disabled={v.status === "approved"}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="p-4 shadow-card border-border flex items-center justify-between gap-4 bg-gradient-subtle">
                <div>
                  <div className="text-sm font-semibold">Ready to ship?</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {allApproved ? "All variants approved · 4,820 contacts will receive this campaign" : "Approve all 3 variants to enable send"}
                  </div>
                </div>
                <Button
                  onClick={send}
                  disabled={!allApproved || sending}
                  className="bg-gradient-primary hover:opacity-90 shadow-elegant gap-1.5"
                >
                  {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send campaign</>}
                </Button>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
