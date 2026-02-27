import { cn } from "@/lib/utils";

interface DsSidebarProps {
  className?: string;
  children: React.ReactNode;
}

function DsSidebar({ className, children }: DsSidebarProps) {
  return (
    <aside
      className={cn("h-screen w-[var(--sidebar-width)] bg-card border-r flex flex-col", className)}
    >
      {children}
    </aside>
  );
}

export { DsSidebar, type DsSidebarProps };
