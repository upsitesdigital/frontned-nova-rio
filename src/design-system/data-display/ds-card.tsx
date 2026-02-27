import { cn } from "@/lib/utils";
import { Card } from "@/design-system/ui/card";

interface DsCardProps {
  className?: string;
  children: React.ReactNode;
}

function DsCard({ className, children }: DsCardProps) {
  return <Card className={cn(className)}>{children}</Card>;
}

export { DsCard, type DsCardProps };
