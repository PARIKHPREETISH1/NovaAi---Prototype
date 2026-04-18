import { cn } from "@/lib/utils";

type Variant = "draft" | "pending" | "approved" | "sent" | "failed" | "regenerating" | "synced" | "neutral";

const styles: Record<Variant, string> = {
  draft: "bg-warning-soft text-warning-foreground border-warning/30",
  pending: "bg-warning-soft text-warning-foreground border-warning/30",
  regenerating: "bg-info-soft text-info border-info/30",
  approved: "bg-success-soft text-success border-success/30",
  sent: "bg-success-soft text-success border-success/30",
  synced: "bg-success-soft text-success border-success/30",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
  neutral: "bg-muted text-muted-foreground border-border",
};

const labels: Partial<Record<Variant, string>> = {
  draft: "Draft",
  pending: "Pending review",
  approved: "Approved",
  sent: "Sent",
  failed: "Failed",
  regenerating: "Regenerating",
  synced: "Synced",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const v = (status as Variant) in styles ? (status as Variant) : "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[v],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full",
        v === "approved" || v === "sent" || v === "synced" ? "bg-success" :
        v === "draft" || v === "pending" ? "bg-warning" :
        v === "failed" ? "bg-destructive" :
        v === "regenerating" ? "bg-info" :
        "bg-muted-foreground"
      )} />
      {labels[v] ?? status}
    </span>
  );
}

export function PersonaBadge({ persona }: { persona: string }) {
  const tone: Record<string, string> = {
    STRATEGIST: "bg-primary-soft text-primary border-primary/20",
    BUILDER: "bg-info-soft text-info border-info/20",
    EXPLORER: "bg-warning-soft text-warning-foreground border-warning/20",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide", tone[persona] ?? "bg-muted text-muted-foreground border-border")}>
      {persona}
    </span>
  );
}
