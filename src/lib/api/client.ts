// Mock API client. Each function mirrors a real REST endpoint and returns a
// Promise — swap the body for `fetch(...)` when wiring to the live backend.
//
// Endpoints:
//   GET  /campaigns                 -> listCampaigns()
//   GET  /campaigns/:id             -> getCampaign(id)
//   POST /campaigns                 -> createCampaign({ topic, context? })
//   PATCH /campaigns/:id/newsletters/:persona -> updateNewsletterStatus(...)
//   POST /campaigns/:id/regenerate  -> regenerateNewsletter(id, persona)
//   POST /campaigns/:id/send        -> sendCampaign(id)
//   GET  /contacts                  -> listContacts()
//   POST /contacts/sync             -> syncContacts()
//   GET  /analytics/summary         -> getAnalyticsSummary()
//   GET  /analytics/:campaignId     -> getCampaignAnalytics(id)
//   GET  /insights/topics           -> listTopicSuggestions()

import { db, buildBlogFor, buildNewsletter, PERSONAS } from "./store";
import type {
  AnalyticsSummary,
  Campaign,
  CampaignAnalytics,
  Contact,
  Newsletter,
  Persona,
  TopicSuggestion,
} from "./types";

// Simulated network latency.
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const NET = { fast: 250, normal: 600, slow: 1500 };

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

// ---------- Campaigns ----------

export async function listCampaigns(): Promise<Campaign[]> {
  await delay(NET.normal);
  return clone(db.campaigns);
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  await delay(NET.fast);
  const c = db.campaigns.find((x) => x.id === id);
  return c ? clone(c) : null;
}

export async function createCampaign(input: { topic: string; context?: string }): Promise<Campaign> {
  await delay(NET.slow);
  const id = `cmp_${String(Date.now()).slice(-6)}`;
  const blog = buildBlogFor(input.topic);
  const created: Campaign = {
    id,
    topic: input.topic,
    slug: input.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    status: "draft",
    createdAt: new Date().toISOString(),
    blogTitle: blog.title,
    blogOutline: blog.outline,
    blogDraft: blog.draft,
    newsletters: PERSONAS.map((p) => buildNewsletter(input.topic, p, "pending")),
  };
  db.campaigns.unshift(created);
  return clone(created);
}

export async function updateNewsletterStatus(
  campaignId: string,
  persona: Persona,
  status: Newsletter["status"]
): Promise<Campaign> {
  await delay(NET.fast);
  const c = db.campaigns.find((x) => x.id === campaignId);
  if (!c) throw new Error("Campaign not found");
  c.newsletters = c.newsletters.map((n) => (n.persona === persona ? { ...n, status } : n));
  if (c.newsletters.every((n) => n.status === "approved") && c.status === "draft") {
    c.status = "approved";
  }
  return clone(c);
}

export async function regenerateNewsletter(campaignId: string, persona: Persona): Promise<Campaign> {
  await delay(NET.slow);
  const c = db.campaigns.find((x) => x.id === campaignId);
  if (!c) throw new Error("Campaign not found");
  const fresh = buildNewsletter(c.topic, persona, "pending");
  c.newsletters = c.newsletters.map((n) =>
    n.persona === persona ? { ...fresh, subject: `${fresh.subject} · v2` } : n
  );
  return clone(c);
}

export async function sendCampaign(campaignId: string): Promise<Campaign> {
  await delay(NET.slow);
  const c = db.campaigns.find((x) => x.id === campaignId);
  if (!c) throw new Error("Campaign not found");
  if (c.newsletters.some((n) => n.status !== "approved")) {
    throw new Error("All variants must be approved before sending");
  }
  const now = new Date();
  const ts = (offsetSec: number) => {
    const d = new Date(now.getTime() + offsetSec * 1000);
    return d.toTimeString().slice(0, 8);
  };
  c.status = "sent";
  c.sentAt = now.toISOString();
  c.hubspotLog = [
    { ts: ts(0), event: `Campaign created in HubSpot (id: ${Math.floor(4000000 + Math.random() * 999999)})`, status: "ok" },
    { ts: ts(4), event: "Synced 3 list segments by persona", status: "ok" },
    { ts: ts(7), event: "4,820 contacts queued for delivery", status: "ok" },
  ];
  return clone(c);
}

// ---------- Contacts ----------

export async function listContacts(): Promise<Contact[]> {
  await delay(NET.normal);
  return clone(db.contacts);
}

export async function syncContacts(): Promise<{ synced: number; conflicts: number }> {
  await delay(NET.slow);
  db.contacts = db.contacts.map((c) => ({ ...c, hubspot: "synced" }));
  return { synced: db.contacts.length, conflicts: 0 };
}

// ---------- Analytics ----------

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  await delay(NET.normal);
  const sentCampaigns = db.campaigns.filter((c) => c.metrics);
  const avg = (key: "openRate" | "ctr") =>
    sentCampaigns.length === 0
      ? 0
      : Math.round((sentCampaigns.reduce((s, c) => s + (c.metrics![key] || 0), 0) / sentCampaigns.length) * 10) / 10;

  return clone({
    campaignsShipped30d: sentCampaigns.length,
    avgOpenRate: avg("openRate"),
    avgCtr: avg("ctr"),
    topPersona: "STRATEGIST" as Persona,
    personaPerformance: [
      { persona: "STRATEGIST" as Persona, openRate: 51.2, ctr: 9.8 },
      { persona: "BUILDER" as Persona, openRate: 44.6, ctr: 8.4 },
      { persona: "EXPLORER" as Persona, openRate: 33.1, ctr: 5.9 },
    ],
    trend: db.trend,
    insights: db.globalInsights,
  });
}

export async function getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics | null> {
  await delay(NET.fast);
  const c = db.campaigns.find((x) => x.id === campaignId);
  if (!c || !c.metrics) return null;
  return clone({ campaignId, metrics: c.metrics, insights: c.insights || [] });
}

// ---------- Insights / Topics ----------

export async function listTopicSuggestions(): Promise<TopicSuggestion[]> {
  await delay(NET.fast);
  return clone(db.topics);
}
