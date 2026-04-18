import { cn } from "@/lib/utils";

type Variant =
  | "draft"
  | "pending"
  | "pending_metrics"
  | "approved"
  | "sent"
  | "failed"
  | "regenerating"
  | "synced"
  | "queued"
  | "delivered"
  | "bounced"
  | "neutral";

const styles: Record<Variant, string> = {
  draft: "bg-warning-soft text-warning-foreground border-warning/30",
  pending: "bg-warning-soft text-warning-foreground border-warning/30",
  pending_metrics: "bg-muted text-muted-foreground border-border",
  regenerating: "bg-info-soft text-info border-info/30",
  approved: "bg-success-soft text-success border-success/30",
  sent: "bg-success-soft text-success border-success/30",
  delivered: "bg-success-soft text-success border-success/30",
  synced: "bg-success-soft text-success border-success/30",
  queued: "bg-info-soft text-info border-info/30",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
  bounced: "bg-destructive/10 text-destructive border-destructive/30",
  neutral: "bg-muted text-muted-foreground border-border",
};

const labels: Partial<Record<Variant, string>> = {
  draft: "Draft",
  pending: "Pending review",
  pending_metrics: "Pending metrics",
  approved: "Approved",
  sent: "Sent",
  delivered: "Delivered",
  failed: "Failed",
  bounced: "Bounced",
  regenerating: "Regenerating",
  synced: "Synced",
  queued: "Queued",
};

const dotColor: Record<Variant, string> = {
  draft: "bg-warning",
  pending: "bg-warning",
  pending_metrics: "bg-muted-foreground",
  regenerating: "bg-info",
  approved: "bg-success",
  sent: "bg-success",
  delivered: "bg-success",
  synced: "bg-success",
  queued: "bg-info",
  failed: "bg-destructive",
  bounced: "bg-destructive",
  neutral: "bg-muted-foreground",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const v = (status as Variant) in styles ? (status as Variant) : "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        styles[v],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[v])} />
      {labels[v] ?? status}
    </span>
  );
}

const personaTone: Record<string, string> = {
  STRATEGIST: "bg-strategist-soft text-strategist border-strategist/25",
  BUILDER: "bg-builder-soft text-builder border-builder/25",
  EXPLORER: "bg-explorer-soft text-explorer border-explorer/25",
};

const personaDot: Record<string, string> = {
  STRATEGIST: "bg-strategist",
  BUILDER: "bg-builder",
  EXPLORER: "bg-explorer",
};

export function PersonaBadge({ persona, className }: { persona: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        personaTone[persona] ?? "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", personaDot[persona] ?? "bg-muted-foreground")} />
      {persona}
    </span>
  );
}

export function PersonaAccentBar({ persona, className }: { persona: string; className?: string }) {
  const bg: Record<string, string> = {
    STRATEGIST: "bg-strategist",
    BUILDER: "bg-builder",
    EXPLORER: "bg-explorer",
  };
  return <div className={cn("h-1 w-full", bg[persona] ?? "bg-muted", className)} />;
}
