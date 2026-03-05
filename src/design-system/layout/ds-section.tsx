import { cn } from "@/lib/utils";

interface DsSectionProps {
  className?: string;
  children: React.ReactNode;
}

function DsSection({ className, children }: DsSectionProps) {
  return <section className={cn("space-y-4", className)}>{children}</section>;
}

export { DsSection, type DsSectionProps };
