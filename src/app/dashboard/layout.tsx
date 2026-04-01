"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { AppToastContainer } from "@/app/_components/app-toast-container";
import { waitForAuthHydration } from "@/stores/auth-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useDashboardPaymentsStore } from "@/stores/dashboard-payments-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useAddressStore } from "@/stores/address-store";
import { useSchedulingStore } from "@/stores/scheduling-store";
import { useServicesStore } from "@/stores/services-store";
import { usePaymentStore } from "@/stores/payment-store";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { signOutClient } from "@/use-cases/sign-out-client";

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
  const { summary, isAuthError, loadSummary } = useDashboardStore();
  const loadPaymentsData = useDashboardPaymentsStore((s) => s.loadPaymentsData);
  const sidebarCollapsed = useSidebarStore((s) => s.collapsed);
  const setSidebarCollapsed = useSidebarStore((s) => s.setCollapsed);

  useEffect(() => {
    waitForAuthHydration().then(() => {
      loadSummary();
      loadPaymentsData();
    });
  }, [loadSummary, loadPaymentsData]);

  useEffect(() => {
    if (isAuthError && !summary) {
      router.push("/login");
    }
  }, [isAuthError, summary, router]);

  const handleSignOut = () => {
    signOutClient();
    router.push("/login");
  };

  const handleScheduleService = () => {
    useServicesStore.getState().reset();
    useSchedulingStore.getState().reset();
    useAddressStore.getState().reset();
    usePaymentStore.getState().reset();
    useConfirmationStore.getState().reset();
    router.push("/dashboard/agendamento/servico");
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
        onScheduleService={handleScheduleService}
        onSignOut={handleSignOut}
        onProfileClick={() => router.push("/dashboard/perfil")}
        onAccountClick={() => router.push("/dashboard/conta")}
      >
        {children}
      </DsClientDashboardShell>
      <AppToastContainer />
    </>
  );
}
