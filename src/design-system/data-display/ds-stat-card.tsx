import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/design-system/ui/card";
import { DsIcon, type DsIconComponent } from "@/design-system/media";

interface DsStatCardTrend {
  value: number;
  positive: boolean;
}

interface DsStatCardProps {
  title: string;
  value: string | number;
  icon?: DsIconComponent;
  trend?: DsStatCardTrend;
  className?: string;
}

function DsStatCard({ title, value, icon, trend, className }: DsStatCardProps) {
  return (
    <Card className={cn("gap-0 py-4", className)}>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{title}</span>
          <span className="text-2xl font-semibold">{value}</span>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-green-600" : "text-red-600",
              )}
            >
              {trend.positive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <DsIcon icon={icon} size="md" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { DsStatCard, type DsStatCardProps, type DsStatCardTrend };
