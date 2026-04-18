import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-3.5">
          <Skeleton className="h-3.5 w-full max-w-[140px]" />
        </td>
      ))}
    </tr>
  );
}

export function CampaignTableSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-2.5 w-1/4" />
          </div>
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function NewsletterCardSkeleton() {
  return (
    <Card className="shadow-card border-border overflow-hidden">
      <Skeleton className="h-1 w-full rounded-none" />
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return (
    <Card className="p-5 shadow-card border-border">
      <Skeleton className="h-2.5 w-24" />
      <Skeleton className="h-7 w-20 mt-3" />
      <Skeleton className="h-2.5 w-32 mt-3" />
    </Card>
  );
}

export function ChartSkeleton({ height = 256 }: { height?: number }) {
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {[60, 85, 45, 70, 90, 55, 75].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
