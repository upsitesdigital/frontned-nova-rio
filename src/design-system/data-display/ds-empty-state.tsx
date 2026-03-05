import { cn } from "@/lib/utils";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsEmptyStateProps {
  icon?: DsIconComponent;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function DsEmptyState({ icon, title, description, action, className }: DsEmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3 py-12 text-center", className)}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <DsIcon icon={icon} size="lg" />
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { DsEmptyState, type DsEmptyStateProps };
