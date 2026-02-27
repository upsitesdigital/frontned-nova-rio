import { cn } from "@/lib/utils";
import { Badge } from "@/design-system/ui/badge";

interface DsDateBadgeProps {
  date: string;
  className?: string;
}

function DsDateBadge({ date, className }: DsDateBadgeProps) {
  return (
    <Badge variant="secondary" className={cn("text-xs font-normal", className)}>
      {date}
    </Badge>
  );
}

export { DsDateBadge, type DsDateBadgeProps };
