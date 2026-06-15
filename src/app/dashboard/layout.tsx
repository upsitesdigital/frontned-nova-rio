"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { HouseIcon, BroomIcon, CurrencyDollarSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import type { DsClientNavItem } from "@/design-system";
import { AppToastContainer } from "@/app/_components/app-toast-container";
import { waitForAuthHydration } from "@/stores/auth/auth-store";
import { useDashboardStore } from "@/stores/client/dashboard-store";
import { useDashboardPaymentsStore } from "@/stores/client/dashboard-payments-store";
import { useSidebarStore } from "@/stores/ui/sidebar-store";
import { useAddressStore } from "@/stores/scheduling/address-store";
import { useSchedulingStore } from "@/stores/scheduling/scheduling-store";
import { useServicesStore } from "@/stores/client/services-store";
import { usePaymentStore } from "@/stores/scheduling/payment-store";
import { useConfirmationStore } from "@/stores/scheduling/confirmation-store";
import { SignOutClient } from "@/use-cases/auth/sign-out-client";

const clientNavItems: DsClientNavItem[] = [
  { path: "/dashboard", label: "Minha Área", icon: HouseIcon },
  { path: "/dashboard/servicos", label: "Meus serviços", icon: BroomIcon },
  { path: "/dashboard/pagamentos", label: "Pagamentos", icon: CurrencyDollarSimpleIcon },
];

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
    SignOutClient.execute();
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
        items={clientNavItems}
        scheduleLabel="Agendar serviço"
        signOutLabel="Sair"
        expandLabel="Expandir menu"
        collapseLabel="Recolher menu"
        notificationsLabel="Notificações"
        settingsLabel="Configurações"
        menuLabel="Menu do usuário"
        profileLabel="Perfil"
        accountLabel="Minha conta"
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
