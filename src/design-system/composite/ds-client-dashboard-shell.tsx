"use client";

import { ListIcon } from "@phosphor-icons/react/dist/ssr";

import { DsSidebarLayout } from "@/design-system/layout";
import { DsTopbar } from "@/design-system/navigation";
import { DsIconButton } from "@/design-system/primitives";
import { DsClientSidebar, type DsClientNavItem } from "./ds-client-sidebar";
import { DsUserActions } from "./ds-user-actions";

export interface DsClientDashboardShellProps {
  items: DsClientNavItem[];
  scheduleLabel: string;
  signOutLabel: string;
  expandLabel: string;
  collapseLabel: string;
  notificationsLabel: string;
  settingsLabel: string;
  menuLabel: string;
  openMenuLabel: string;
  profileLabel: string;
  accountLabel: string;
  activePath?: string;
  sidebarCollapsed: boolean;
  onSidebarCollapsedChange: (collapsed: boolean) => void;
  sidebarMobileOpen: boolean;
  onSidebarMobileOpenChange: (open: boolean) => void;
  userInitials: string;
  notificationCount?: number;
  onNavigate?: (path: string) => void;
  onScheduleService?: () => void;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onAccountClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationClick?: () => void;
  profileHref?: string;
  accountHref?: string;
  children: React.ReactNode;
}

export function DsClientDashboardShell({
  items,
  scheduleLabel,
  signOutLabel,
  expandLabel,
  collapseLabel,
  notificationsLabel,
  settingsLabel,
  menuLabel,
  openMenuLabel,
  profileLabel,
  accountLabel,
  activePath,
  sidebarCollapsed,
  onSidebarCollapsedChange,
  sidebarMobileOpen,
  onSidebarMobileOpenChange,
  userInitials,
  notificationCount = 0,
  onNavigate,
  onScheduleService,
  onSignOut,
  onProfileClick,
  onAccountClick,
  onSettingsClick,
  onNotificationClick,
  profileHref,
  accountHref,
  children,
}: DsClientDashboardShellProps) {
  return (
    <DsSidebarLayout
      mobileOpen={sidebarMobileOpen}
      onMobileClose={() => onSidebarMobileOpenChange(false)}
      sidebar={
        <DsClientSidebar
          items={items}
          scheduleLabel={scheduleLabel}
          signOutLabel={signOutLabel}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
          activePath={activePath}
          collapsed={sidebarCollapsed}
          onCollapsedChange={onSidebarCollapsedChange}
          onMobileClose={() => onSidebarMobileOpenChange(false)}
          onNavigate={(path) => {
            onSidebarMobileOpenChange(false);
            onNavigate?.(path);
          }}
          onScheduleService={onScheduleService}
          onSignOut={onSignOut}
        />
      }
    >
      <div className="flex h-screen flex-col">
        <DsTopbar>
          <DsIconButton
            icon={ListIcon}
            ariaLabel={openMenuLabel}
            variant="ghost"
            className="md:hidden"
            onClick={() => {
              onSidebarCollapsedChange(false);
              onSidebarMobileOpenChange(true);
            }}
          />
          <DsUserActions
            className="ml-auto"
            notificationsLabel={notificationsLabel}
            settingsLabel={settingsLabel}
            menuLabel={menuLabel}
            profileLabel={profileLabel}
            accountLabel={accountLabel}
            initials={userInitials}
            notificationCount={notificationCount}
            profileHref={profileHref}
            accountHref={accountHref}
            onProfileClick={onProfileClick}
            onAccountClick={onAccountClick}
            onSettingsClick={onSettingsClick}
            onNotificationClick={onNotificationClick}
          />
        </DsTopbar>

        <div className="flex-1 overflow-y-auto bg-nova-gray-50 p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </DsSidebarLayout>
  );
}

