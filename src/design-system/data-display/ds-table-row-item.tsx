import { cn } from "@/lib/core/utils";
import { TableRow } from "@/design-system/ui/table";

interface DsTableRowItemProps {
  className?: string;
  children: React.ReactNode;
}

function DsTableRowItem({ className, children }: DsTableRowItemProps) {
  return <TableRow className={cn(className)}>{children}</TableRow>;
}

export { DsTableRowItem, type DsTableRowItemProps };
