import { cn } from "@/lib/utils";

interface DsFormGroupProps {
  className?: string;
  children: React.ReactNode;
}

function DsFormGroup({ className, children }: DsFormGroupProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

export { DsFormGroup, type DsFormGroupProps };
