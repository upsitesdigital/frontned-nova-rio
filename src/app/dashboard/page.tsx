"use client";

import { DsDiscountCard, DsHighlightCard } from "@/design-system";
import { useDashboardStore } from "@/stores/dashboard-store";
import { DashboardServiceHistory } from "./_components/dashboard-service-history";
import { DashboardPaymentsPanel } from "./_components/dashboard-payments-panel";
import { ServiceDetailModal } from "./servicos/_components/service-detail-modal";

export default function DashboardPage() {
  const { summary, isLoading, selectedDetailEntry, setSelectedDetailEntry } = useDashboardStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-base text-nova-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div>
          <h1 className="text-5xl font-semibold leading-[1.3] tracking-[-1.92px] text-black">
            Olá, {summary?.clientName ?? ""}
          </h1>
          <p className="mt-2 text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            Sua limpeza pay per use para escritórios e consultórios de alto padrão.
          </p>
        </div>

        <div className="mt-4 flex gap-4">
          <DsHighlightCard
            title="Próximo serviço"
            value={summary?.nextAppointment?.date ?? "—"}
            subtitle={summary?.nextAppointment?.cancellationNote ?? "Nenhum agendamento"}
            valueColor="text-nova-primary-dark"
            className="flex-1"
          />
          <DsHighlightCard
            title="Agendamentos"
            value={String(summary?.appointmentsCount ?? 0)}
            subtitle={summary?.appointmentsCountLabel ?? "Nos últimos 2 meses"}
            valueColor="text-nova-primary-dark"
            className="flex-1"
          />
        </div>

        <DashboardServiceHistory
          months={summary?.serviceHistory ?? []}
          onViewEntry={(entry) => setSelectedDetailEntry(entry)}
        />
      </div>

      <div className="flex w-125.25 shrink-0 flex-col gap-6">
        <DsDiscountCard className="h-33">
          <span>
            Agende agora serviços recorrentes semanais e ganhe{" "}
            <span className="font-semibold">10% de desconto</span>
          </span>
        </DsDiscountCard>

        <DashboardPaymentsPanel cards={[]} payments={[]} paymentsMonthLabel="Este mês" />
      </div>
      <ServiceDetailModal
        entry={selectedDetailEntry}
        onClose={() => setSelectedDetailEntry(null)}
      />
    </div>
  );
}
