import { cn } from "@/lib/utils";

interface DsSidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function DsSidebarLayout({ sidebar, children, className }: DsSidebarLayoutProps) {
  return (
    <div className={cn("grid grid-cols-[var(--sidebar-width)_1fr] min-h-screen", className)}>
      {sidebar}
      <main>{children}</main>
    </div>
  );
}

export { DsSidebarLayout, type DsSidebarLayoutProps };
