import { cn } from "@/lib/utils";

interface DsSidebarProps {
  collapsed?: boolean;
  className?: string;
  children: React.ReactNode;
}

function DsSidebar({ collapsed = false, className, children }: DsSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-screen flex-col justify-between border-r border-nova-gray-300 bg-secondary py-12 transition-all duration-300",
        collapsed ? "w-[88px] px-3" : "w-[var(--sidebar-width)] px-6",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export { DsSidebar, type DsSidebarProps };
