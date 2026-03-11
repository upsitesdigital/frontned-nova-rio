"use client";

import { DsSidebarLayout } from "@/design-system/layout";
import { DsTopbar } from "@/design-system/navigation";
import { DsClientSidebar } from "./ds-client-sidebar";
import { DsUserActions } from "./ds-user-actions";

interface DsClientDashboardShellProps {
  activePath?: string;
  userInitials: string;
  notificationCount?: number;
  onNavigate?: (path: string) => void;
  onScheduleService?: () => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}

function DsClientDashboardShell({
  activePath,
  userInitials,
  notificationCount = 0,
  onNavigate,
  onScheduleService,
  onSignOut,
  children,
}: DsClientDashboardShellProps) {
  return (
    <DsSidebarLayout
      sidebar={
        <DsClientSidebar
          activePath={activePath}
          onNavigate={onNavigate}
          onScheduleService={onScheduleService}
          onSignOut={onSignOut}
        />
      }
    >
      <div className="flex h-screen flex-col">
        <DsTopbar>
          <div />
          <DsUserActions initials={userInitials} notificationCount={notificationCount} />
        </DsTopbar>

        <div className="flex-1 overflow-y-auto bg-nova-gray-50 p-8">{children}</div>
      </div>
    </DsSidebarLayout>
  );
}

export { DsClientDashboardShell, type DsClientDashboardShellProps };
