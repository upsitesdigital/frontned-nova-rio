import { cn } from "@/lib/utils";

interface DsTransactionCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function DsTransactionCard({ title, action, children, className }: DsTransactionCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-clip rounded-[20px] border border-nova-gray-100 bg-white px-6 py-8",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] font-medium leading-[1.3] text-black">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export { DsTransactionCard, type DsTransactionCardProps };
