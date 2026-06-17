import { cn } from "@/lib/core/utils";

interface DsSidebarProps {
  collapsed?: boolean;
  className?: string;
  children: React.ReactNode;
}

function DsSidebar({ collapsed = false, className, children }: DsSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-screen flex-col justify-between gap-8 overflow-y-auto border-r border-nova-gray-300 bg-secondary py-12 transition-all duration-300",
        "max-md:w-56 max-md:px-4 max-md:py-8",
        collapsed ? "w-22 px-3" : "w-(--sidebar-width) px-6",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export { DsSidebar, type DsSidebarProps };
