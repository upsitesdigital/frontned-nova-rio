"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { DsToastContainer } from "@/design-system";
import { useAuthStore } from "@/stores/auth-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useDashboardPaymentsStore } from "@/stores/dashboard-payments-store";
import { useSidebarStore } from "@/stores/sidebar-store";

const DsClientDashboardShell = dynamic(
  () =>
    import("@/design-system/composite/ds-client-dashboard-shell").then(
      (mod) => mod.DsClientDashboardShell,
    ),
  { ssr: false },
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { summary, error, loadSummary } = useDashboardStore();
  const loadPaymentsData = useDashboardPaymentsStore((s) => s.loadPaymentsData);
  const sidebarCollapsed = useSidebarStore((s) => s.collapsed);
  const setSidebarCollapsed = useSidebarStore((s) => s.setCollapsed);

  useEffect(() => {
    loadSummary();
    loadPaymentsData();
  }, [loadSummary, loadPaymentsData]);

  useEffect(() => {
    if (error && !summary) {
      router.push("/login");
    }
  }, [error, summary, router]);

  const handleSignOut = () => {
    useAuthStore.getState().reset();
    useDashboardStore.getState().reset();
    useDashboardPaymentsStore.getState().reset();
    router.push("/login");
  };

  return (
    <>
      <DsClientDashboardShell
        activePath={pathname}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarCollapsedChange={setSidebarCollapsed}
        userInitials={summary?.clientName?.charAt(0) ?? ""}
        notificationCount={0}
        onNavigate={(path) => router.push(path)}
        onScheduleService={() => router.push("/agendamento")}
        onSignOut={handleSignOut}
        onProfileClick={() => router.push("/dashboard/perfil")}
        onAccountClick={() => router.push("/dashboard/conta")}
      >
        {children}
      </DsClientDashboardShell>
      <DsToastContainer />
    </>
  );
}
