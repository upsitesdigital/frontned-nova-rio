import { cn } from "@/lib/utils";

interface DsSidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function DsSidebarLayout({ sidebar, children, className }: DsSidebarLayoutProps) {
  return (
    <div className={cn("grid min-h-screen grid-cols-[auto_1fr]", className)}>
      {sidebar}
      <main className="min-w-0 bg-nova-gray-50">{children}</main>
    </div>
  );
}

export { DsSidebarLayout, type DsSidebarLayoutProps };
