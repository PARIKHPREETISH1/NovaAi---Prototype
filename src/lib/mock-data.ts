export type Persona = "STRATEGIST" | "BUILDER" | "EXPLORER";
export type CampaignStatus = "draft" | "pending" | "approved" | "sent" | "failed";

export const PERSONAS: Persona[] = ["STRATEGIST", "BUILDER", "EXPLORER"];

export const personaMeta: Record<Persona, { label: string; tagline: string; tone: string }> = {
  STRATEGIST: { label: "Strategist", tagline: "Executive · ROI-focused", tone: "Decisive, data-led, outcome-oriented" },
  BUILDER: { label: "Builder", tagline: "Operational · Implementation", tone: "Practical, step-by-step, hands-on" },
  EXPLORER: { label: "Explorer", tagline: "Freelance · Curious", tone: "Energetic, experimental, conversational" },
};

export interface NewsletterVariant {
  persona: Persona;
  subject: string;
  preview: string;
  body: string;
  status: "pending" | "approved" | "regenerating";
}

export interface Campaign {
  id: string;
  topic: string;
  slug: string;
  status: CampaignStatus;
  createdAt: string;
  sentAt?: string;
  blogTitle: string;
  blogOutline: string[];
  blogDraft: string;
  newsletters: NewsletterVariant[];
  metrics?: {
    sent: number;
    opens: number;
    clicks: number;
    openRate: number;
    ctr: number;
    byPersona: Record<Persona, { openRate: number; ctr: number; sent: number }>;
  };
  insights?: string[];
  hubspotLog?: { ts: string; event: string; status: "ok" | "warn" | "err" }[];
}

const sampleBlog = (topic: string) => ({
  title: `${topic}: A Practical Playbook for Modern Creative Teams`,
  outline: [
    "Why this matters now for small creative agencies",
    "The 3-step automation framework",
    "Tooling stack and integration patterns",
    "Measuring ROI in the first 30 days",
    "Common pitfalls and how to avoid them",
  ],
  draft: `Creative agencies are under pressure to ship more, faster, without diluting craft. ${topic} is the wedge that lets a 6-person team punch like a 20-person studio.

In this piece, we walk through the operating model NovaMind clients use to compress production cycles by 40% — without adding headcount. We cover the framework, the tool stack, and the metrics that actually correlate with revenue.

The framework rests on three pillars: capture, structure, and distribute. Capture means turning every client touchpoint into structured input. Structure means letting AI handle the first 60% of the draft so humans can focus on the last 40% that matters. Distribute means meeting each persona where they already read.

By the end of this guide, you will have a concrete checklist you can run with your team next Monday.`,
});

const newsletter = (topic: string, persona: Persona, status: NewsletterVariant["status"] = "pending"): NewsletterVariant => {
  const map: Record<Persona, { subject: string; preview: string; body: string }> = {
    STRATEGIST: {
      subject: `${topic}: the 40% margin lever your competitors missed`,
      preview: "A board-ready breakdown of the ROI math.",
      body: `Hi {first_name},\n\nIf you're benchmarking automation investment this quarter, here is the one-page summary your CFO will actually read.\n\nClients who deployed this playbook saw a 32% lift in qualified pipeline within 60 days, with payback under one cycle. We unpack the assumptions and the failure modes inside.\n\n— The NovaMind team`,
    },
    BUILDER: {
      subject: `Ship ${topic} this sprint — here's the exact stack`,
      preview: "Step-by-step setup with code snippets.",
      body: `Hey {first_name},\n\nWe wrote up the implementation we wish we'd had a year ago. Stack, env vars, gotchas, and a Loom of the whole thing wired end-to-end.\n\nEstimated time to first working version: 90 minutes. Skip the parts you already have.\n\nLet us know what breaks.`,
    },
    EXPLORER: {
      subject: `okay this ${topic} thing is actually wild 👀`,
      preview: "One weekend project, three new clients.",
      body: `hey {first_name} —\n\nspent saturday playing with this and it changed how I pitch entirely. closed two retainers monday morning off the back of one demo.\n\nlinking the breakdown + the exact prompts I used. steal everything.\n\ntalk soon`,
    },
  };
  return { persona, status, ...map[persona] };
};

const buildCampaign = (
  id: string,
  topic: string,
  status: CampaignStatus,
  daysAgo: number,
  withMetrics = false
): Campaign => {
  const created = new Date(Date.now() - daysAgo * 86400000);
  const blog = sampleBlog(topic);
  const c: Campaign = {
    id,
    topic,
    slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    status,
    createdAt: created.toISOString(),
    sentAt: status === "sent" ? new Date(created.getTime() + 86400000).toISOString() : undefined,
    blogTitle: blog.title,
    blogOutline: blog.outline,
    blogDraft: blog.draft,
    newsletters: PERSONAS.map((p) => newsletter(topic, p, status === "sent" || status === "approved" ? "approved" : "pending")),
  };
  if (withMetrics) {
    c.metrics = {
      sent: 4820,
      opens: 2074,
      clicks: 389,
      openRate: 43.0,
      ctr: 8.07,
      byPersona: {
        STRATEGIST: { openRate: 51.2, ctr: 9.8, sent: 1640 },
        BUILDER: { openRate: 44.6, ctr: 8.4, sent: 1720 },
        EXPLORER: { openRate: 33.1, ctr: 5.9, sent: 1460 },
      },
    };
    c.insights = [
      "Strategist open rate outperformed benchmark by 18%. Subject lines anchored on margin language continue to win.",
      "Builder CTR is steady but link placement above the code snippet would likely add 1–2 points.",
      "Explorer engagement dipped 6% week-over-week. Consider a more visual hook or shorter subject (<40 chars).",
    ];
    c.hubspotLog = [
      { ts: "10:02:14", event: "Campaign created in HubSpot (id: 4892011)", status: "ok" },
      { ts: "10:02:18", event: "Synced 3 list segments by persona", status: "ok" },
      { ts: "10:02:21", event: "4,820 contacts queued for delivery", status: "ok" },
      { ts: "10:14:02", event: "Delivery complete · 4,802 delivered · 18 bounced", status: "warn" },
      { ts: "11:30:00", event: "First open recorded", status: "ok" },
    ];
  }
  return c;
};

export const campaigns: Campaign[] = [
  buildCampaign("cmp_018", "AI-assisted client onboarding", "sent", 3, true),
  buildCampaign("cmp_017", "Productizing creative retainers", "sent", 10, true),
  buildCampaign("cmp_016", "Async creative reviews that don't suck", "sent", 17, true),
  buildCampaign("cmp_015", "Pricing AI deliverables for agencies", "approved", 1),
  buildCampaign("cmp_014", "Building an internal prompt library", "draft", 0),
  buildCampaign("cmp_013", "Replacing status meetings with Loom", "sent", 24, true),
];

export const topicSuggestions = [
  { topic: "Selling AI services to skeptical clients", confidence: 92, rationale: "High intent in Builder segment based on last 3 campaigns." },
  { topic: "The agency P&L in an AI-native world", confidence: 88, rationale: "Strategist persona engagement up 18% on margin topics." },
  { topic: "Prompt patterns for creative directors", confidence: 81, rationale: "Explorer cohort showing curiosity around tactical prompts." },
  { topic: "From freelancer to micro-agency in 90 days", confidence: 76, rationale: "Strong Explorer signal; aligns with Q2 content theme." },
];

export const contacts = [
  { id: "1", name: "Maya Lindqvist", email: "maya@nordstudio.co", persona: "STRATEGIST" as Persona, hubspot: "synced", created: "2025-01-12" },
  { id: "2", name: "Daniel Okafor", email: "dan@buildhouse.io", persona: "BUILDER" as Persona, hubspot: "synced", created: "2025-01-14" },
  { id: "3", name: "Priya Raman", email: "priya@solo.studio", persona: "EXPLORER" as Persona, hubspot: "pending", created: "2025-01-18" },
  { id: "4", name: "Tomás Vidal", email: "tomas@vidalandco.com", persona: "STRATEGIST" as Persona, hubspot: "synced", created: "2025-01-19" },
  { id: "5", name: "Avery Chen", email: "avery@chen.work", persona: "BUILDER" as Persona, hubspot: "failed", created: "2025-01-20" },
  { id: "6", name: "Lena Hoffmann", email: "lena@hoffmann.dev", persona: "EXPLORER" as Persona, hubspot: "synced", created: "2025-01-22" },
  { id: "7", name: "Idris Bello", email: "idris@bellocreative.com", persona: "STRATEGIST" as Persona, hubspot: "synced", created: "2025-01-25" },
  { id: "8", name: "Sara Kowalski", email: "sara@kowalski.studio", persona: "BUILDER" as Persona, hubspot: "synced", created: "2025-02-01" },
  { id: "9", name: "Jamal Reeves", email: "jamal@reevesco.io", persona: "EXPLORER" as Persona, hubspot: "synced", created: "2025-02-04" },
  { id: "10", name: "Hiroshi Tanaka", email: "h.tanaka@tnk.jp", persona: "STRATEGIST" as Persona, hubspot: "synced", created: "2025-02-08" },
  { id: "11", name: "Noor Al-Sayed", email: "noor@alsayed.design", persona: "BUILDER" as Persona, hubspot: "pending", created: "2025-02-11" },
  { id: "12", name: "Eli Bergström", email: "eli@bergstrom.co", persona: "EXPLORER" as Persona, hubspot: "synced", created: "2025-02-14" },
];

export const trendData = [
  { week: "W1", openRate: 38, ctr: 6.2 },
  { week: "W2", openRate: 41, ctr: 6.8 },
  { week: "W3", openRate: 39, ctr: 7.1 },
  { week: "W4", openRate: 44, ctr: 7.6 },
  { week: "W5", openRate: 42, ctr: 8.0 },
  { week: "W6", openRate: 46, ctr: 8.3 },
  { week: "W7", openRate: 43, ctr: 8.1 },
];

export const personaPerformance = [
  { persona: "Strategist", openRate: 51.2, ctr: 9.8 },
  { persona: "Builder", openRate: 44.6, ctr: 8.4 },
  { persona: "Explorer", openRate: 33.1, ctr: 5.9 },
];
