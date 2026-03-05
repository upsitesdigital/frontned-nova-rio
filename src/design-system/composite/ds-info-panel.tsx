import { cn } from "@/lib/utils";

interface DsInfoPanelProps {
  children: React.ReactNode;
  className?: string;
}

function DsInfoPanel({ children, className }: DsInfoPanelProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-4 overflow-clip rounded-[10px] bg-nova-gray-50 p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { DsInfoPanel, type DsInfoPanelProps };
