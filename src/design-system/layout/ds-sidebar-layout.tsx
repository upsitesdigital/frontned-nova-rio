import { cn } from "@/lib/core/utils";

interface DsSidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

function DsSidebarLayout({
  sidebar,
  children,
  mobileOpen = false,
  onMobileClose,
  className,
}: DsSidebarLayoutProps) {
  return (
    <div className={cn("flex min-h-screen md:grid md:grid-cols-[auto_1fr]", className)}>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:static md:z-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebar}
      </div>
      <main className="min-w-0 flex-1 bg-nova-gray-50">{children}</main>
    </div>
  );
}

export { DsSidebarLayout, type DsSidebarLayoutProps };
