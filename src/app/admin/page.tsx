"use client";

import { useRouter } from "next/navigation";
import { BroomIcon, UsersThreeIcon, HourglassIcon } from "@phosphor-icons/react/dist/ssr";
import { DsHighlightCard, DsLoadingState, DsAlert } from "@/design-system";
import { useAdminProfileStore } from "@/stores/admin-profile-store";
import { AdminAgendaPanel } from "./_components/admin-agenda-panel";
import { AdminQuickActionsPanel } from "./_components/admin-quick-actions-panel";

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    profile,
    todayAppointmentsCount,
    activeClientsCount,
    pendingServicesCount,
    isLoading,
    error,
  } = useAdminProfileStore();

  if (isLoading) {
    return <DsLoadingState className="my-20" />;
  }

  if (error) {
    return (
      <div className="py-20">
        <DsAlert variant="error" title="Erro" description={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-5xl font-semibold leading-[1.3] tracking-[-1.92px] text-black">
          Olá, {profile?.name ?? "Admin"}
        </h1>
        <p className="mt-2 text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
          Visão geral dos serviços e agendamentos.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <DsHighlightCard
          title="Agendamentos Hoje"
          value={String(todayAppointmentsCount)}
          icon={BroomIcon}
          iconColor="text-nova-primary"
          iconBgColor="bg-nova-primary-light"
          valueColor="text-nova-primary-dark"
          className="flex-1"
        />
        <DsHighlightCard
          title="Clientes ativos"
          value={String(activeClientsCount)}
          icon={UsersThreeIcon}
          iconColor="text-nova-purple"
          iconBgColor="bg-nova-purple-light"
          valueColor="text-nova-purple"
          className="flex-1"
        />
        <DsHighlightCard
          title="Serviços pendentes"
          value={String(pendingServicesCount)}
          icon={HourglassIcon}
          iconColor="text-nova-warning"
          iconBgColor="bg-nova-warning-lighter"
          valueColor="text-nova-warning"
          className="flex-1"
        />
      </div>

      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <div className="min-w-0 flex-1">
          <AdminAgendaPanel />
        </div>
        <div className="w-full shrink-0 lg:w-125">
          <AdminQuickActionsPanel onNavigate={(path) => router.push(path)} />
        </div>
      </div>
    </div>
  );
}
