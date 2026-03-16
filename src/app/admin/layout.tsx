"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { DsToastContainer } from "@/design-system";
import { useAuthStore, waitForAuthHydration } from "@/stores/auth-store";
import { useAdminProfileStore } from "@/stores/admin-profile-store";
import { useAdminAgendaStore } from "@/stores/admin-agenda-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { signOutAdmin } from "@/use-cases/sign-out-admin";

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
  const { profile, isLoading, isAuthError, loadDashboard } = useAdminProfileStore();
  const hydrateAgenda = useAdminAgendaStore((s) => s.hydrateFromDashboard);
  const userType = useAuthStore((s) => s.userType);
  const sidebarCollapsed = useSidebarStore((s) => s.collapsed);
  const setSidebarCollapsed = useSidebarStore((s) => s.setCollapsed);

  useEffect(() => {
    waitForAuthHydration().then(async () => {
      const data = await loadDashboard();
      if (data) {
        hydrateAgenda(data.agendaItems, data.agendaTotal, data.serviceOptions);
      }
    });
  }, [loadDashboard, hydrateAgenda]);

  useEffect(() => {
    if (isAuthError && !profile) {
      router.push("/login");
    } else if (userType && userType !== "admin") {
      router.push("/dashboard");
    }
  }, [isAuthError, profile, userType, router]);

  const handleSignOut = () => {
    signOutAdmin();
    useAdminProfileStore.getState().reset();
    useAdminAgendaStore.getState().reset();
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
