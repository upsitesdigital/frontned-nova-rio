"use client";

import { DsSidebarLayout } from "@/design-system/layout";
import { DsTopbar } from "@/design-system/navigation";
import { DsAdminSidebar } from "./ds-admin-sidebar";
import { DsUserActions } from "./ds-user-actions";

interface DsAdminDashboardShellProps {
  activePath?: string;
  sidebarCollapsed: boolean;
  onSidebarCollapsedChange: (collapsed: boolean) => void;
  userInitials: string;
  notificationCount?: number;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onAccountClick?: () => void;
  children: React.ReactNode;
}

function DsAdminDashboardShell({
  activePath,
  sidebarCollapsed,
  onSidebarCollapsedChange,
  userInitials,
  notificationCount = 0,
  onNavigate,
  onSignOut,
  onProfileClick,
  onAccountClick,
  children,
}: DsAdminDashboardShellProps) {
  return (
    <DsSidebarLayout
      sidebar={
        <DsAdminSidebar
          activePath={activePath}
          collapsed={sidebarCollapsed}
          onCollapsedChange={onSidebarCollapsedChange}
          onNavigate={onNavigate}
          onSignOut={onSignOut}
        />
      }
    >
      <div className="flex h-screen flex-col">
        <DsTopbar>
          <div />
          <DsUserActions
            initials={userInitials}
            notificationCount={notificationCount}
            onProfileClick={onProfileClick}
            onAccountClick={onAccountClick}
          />
        </DsTopbar>

        <div className="flex-1 overflow-y-auto bg-nova-gray-50 p-8">{children}</div>
      </div>
    </DsSidebarLayout>
  );
}

export { DsAdminDashboardShell, type DsAdminDashboardShellProps };
