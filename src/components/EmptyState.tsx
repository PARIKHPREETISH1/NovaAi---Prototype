import { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: any;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6 border border-dashed border-border rounded-lg bg-secondary/20",
        className
      )}
    >
      <div className="h-11 w-11 rounded-full bg-card border border-border grid place-items-center mb-3 shadow-sm">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      {description && (
        <div className="text-xs text-muted-foreground mt-1.5 max-w-sm leading-relaxed">{description}</div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
