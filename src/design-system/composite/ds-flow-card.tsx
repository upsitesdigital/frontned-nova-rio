import { cn } from "@/lib/core/utils";

interface DsFlowCardProps {
  children: React.ReactNode;
  className?: string;
}

function DsFlowCard({ children, className }: DsFlowCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-12 overflow-clip rounded-2xl border border-nova-gray-300 px-13 py-16",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { DsFlowCard, type DsFlowCardProps };
