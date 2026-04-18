// Public surface of the mock API layer.
// Pages should import from "@/lib/api" only — never reach into store.ts directly.
export * from "./types";
export { PERSONAS, personaMeta } from "./store";
export {
  listCampaigns,
  getCampaign,
  createCampaign,
  updateNewsletterStatus,
  regenerateNewsletter,
  sendCampaign,
  listContacts,
  syncContacts,
  getAnalyticsSummary,
  getCampaignAnalytics,
  listTopicSuggestions,
} from "./client";
