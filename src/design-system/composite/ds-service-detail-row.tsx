import { cn } from "@/lib/utils";

interface DsServiceDetailRowProps {
  children: React.ReactNode;
  className?: string;
}

function DsServiceDetailRow({ children, className }: DsServiceDetailRowProps) {
  return (
    <div
      className={cn(
        "flex h-14 items-center justify-between overflow-clip rounded-[10px] border border-nova-gray-100 px-4 py-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { DsServiceDetailRow, type DsServiceDetailRowProps };
