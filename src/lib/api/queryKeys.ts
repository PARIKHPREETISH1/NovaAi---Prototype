export const queryKeys = {
  campaigns: ["campaigns"] as const,
  campaign: (id: string) => ["campaigns", id] as const,
  contacts: ["contacts"] as const,
  analyticsSummary: ["analytics", "summary"] as const,
  campaignAnalytics: (id: string) => ["analytics", id] as const,
  topics: ["insights", "topics"] as const,
};
