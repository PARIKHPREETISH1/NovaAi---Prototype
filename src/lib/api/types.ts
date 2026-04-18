// Shared API types — shaped exactly like the eventual backend responses.
// When wiring to a real backend, only `client.ts` needs to change.

export type Persona = "STRATEGIST" | "BUILDER" | "EXPLORER";

export type CampaignStatus = "draft" | "pending" | "approved" | "sent" | "failed";

export type NewsletterStatus = "pending" | "approved" | "regenerating";

export type HubspotEventStatus = "ok" | "warn" | "err";

export interface Newsletter {
  persona: Persona;
  subject: string;
  preview: string;
  body: string;
  status: NewsletterStatus;
}

export interface PersonaMetric {
  openRate: number;
  ctr: number;
  sent: number;
}

export interface CampaignMetrics {
  sent: number;
  opens: number;
  clicks: number;
  openRate: number;
  ctr: number;
  byPersona: Record<Persona, PersonaMetric>;
}

export interface HubspotLogEntry {
  ts: string;
  event: string;
  status: HubspotEventStatus;
}

export interface AIInsight {
  id: string;
  tone: "win" | "warn" | "info";
  text: string;
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
  newsletters: Newsletter[];
  metrics?: CampaignMetrics;
  insights?: AIInsight[];
  hubspotLog?: HubspotLogEntry[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  persona: Persona;
  hubspot: "synced" | "pending" | "failed";
  created: string;
}

export interface TopicSuggestion {
  id: string;
  topic: string;
  confidence: number;
  rationale: string;
}

export interface AnalyticsSummary {
  campaignsShipped30d: number;
  avgOpenRate: number;
  avgCtr: number;
  topPersona: Persona;
  personaPerformance: { persona: Persona; openRate: number; ctr: number }[];
  trend: { week: string; openRate: number; ctr: number }[];
  insights: AIInsight[];
}

export interface CampaignAnalytics {
  campaignId: string;
  metrics: CampaignMetrics;
  insights: AIInsight[];
}
