"use client";

import { DsSidebarLayout } from "@/design-system/layout";
import { DsTopbar } from "@/design-system/navigation";
import { DsAdminSidebar, type DsAdminNavItem } from "./ds-admin-sidebar";
import { DsUserActions } from "./ds-user-actions";

interface DsAdminDashboardShellProps {
  items: DsAdminNavItem[];
  signOutLabel: string;
  expandLabel: string;
  collapseLabel: string;
  notificationsLabel: string;
  settingsLabel: string;
  menuLabel: string;
  profileLabel: string;
  accountLabel: string;
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
  items,
  signOutLabel,
  expandLabel,
  collapseLabel,
  notificationsLabel,
  settingsLabel,
  menuLabel,
  profileLabel,
  accountLabel,
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
          items={items}
          signOutLabel={signOutLabel}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
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
            notificationsLabel={notificationsLabel}
            settingsLabel={settingsLabel}
            menuLabel={menuLabel}
            profileLabel={profileLabel}
            accountLabel={accountLabel}
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
