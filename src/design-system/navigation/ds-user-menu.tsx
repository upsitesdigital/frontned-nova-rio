import { cn } from "@/lib/core/utils";

interface DsUserMenuProps {
  children: React.ReactNode;
  className?: string;
}

function DsUserMenu({ children, className }: DsUserMenuProps) {
  return (
    <div className={cn("flex flex-col items-end", className)}>
      <div className="mr-4 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-white" />
      <div className="overflow-clip rounded-[10px] bg-white p-2 shadow-(--nova-shadow-soft)">
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}

export { DsUserMenu, type DsUserMenuProps };
