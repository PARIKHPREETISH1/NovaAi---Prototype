// Backwards-compat shim. The canonical data + API now lives in `src/lib/api`.
// New code should import from "@/lib/api" instead of this file.
export type { Persona, CampaignStatus, Newsletter as NewsletterVariant, Campaign } from "./api/types";
export { PERSONAS, personaMeta } from "./api/store";
import { db } from "./api/store";

export const campaigns = db.campaigns;
export const contacts = db.contacts;
export const trendData = db.trend;
export const personaPerformance = [
  { persona: "Strategist", openRate: 51.2, ctr: 9.8 },
  { persona: "Builder", openRate: 44.6, ctr: 8.4 },
  { persona: "Explorer", openRate: 33.1, ctr: 5.9 },
];
export const topicSuggestions = db.topics;
