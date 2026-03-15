"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { DsToastContainer } from "@/design-system";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth-store";
import { useAdminDashboardStore } from "@/stores/admin-dashboard-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useToastStore } from "@/stores/toast-store";

// Direct file import required for next/dynamic code-splitting
const DsAdminDashboardShell = dynamic(
  () =>
    import("@/design-system/composite/ds-admin-dashboard-shell").then(
      (mod) => mod.DsAdminDashboardShell,
    ),
  { ssr: false },
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, isLoading, isAuthError, loadDashboard } = useAdminDashboardStore();
  const userType = useAuthStore((s) => s.userType);
  const sidebarCollapsed = useSidebarStore((s) => s.collapsed);
  const setSidebarCollapsed = useSidebarStore((s) => s.setCollapsed);

  useEffect(() => {
    waitForAuthHydration().then(() => {
      loadDashboard();
    });
  }, [loadDashboard]);

  useEffect(() => {
    if (isAuthError && !profile) {
      router.push("/login");
    } else if (userType && userType !== "admin") {
      router.push("/dashboard");
    }
  }, [isAuthError, profile, userType, router]);

  const handleSignOut = () => {
    useAuthStore.getState().reset();
    useAdminDashboardStore.getState().reset();
    useSidebarStore.getState().setCollapsed(false);
    useToastStore.getState().reset();
    router.push("/login");
  };

  if (isLoading || (!profile && !isAuthError)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-base text-nova-gray-400" role="status">
          Carregando...
        </p>
      </div>
    );
  }

  return (
    <>
      <DsAdminDashboardShell
        activePath={pathname}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarCollapsedChange={setSidebarCollapsed}
        userInitials={profile?.name?.charAt(0) ?? "A"}
        notificationCount={0}
        onNavigate={(path) => router.push(path)}
        onSignOut={handleSignOut}
      >
        {children}
      </DsAdminDashboardShell>
      <DsToastContainer />
    </>
  );
}
