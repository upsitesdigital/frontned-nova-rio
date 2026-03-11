"use client";

import { useState } from "react";
import { DsDiscountCard, DsHighlightCard } from "@/design-system";
import { useDashboardStore } from "@/stores/dashboard-store";
import { DashboardServiceHistory } from "./_components/dashboard-service-history";
import { DashboardPaymentsPanel } from "./_components/dashboard-payments-panel";
import type { RegisteredCard, RecentPayment } from "./_components/dashboard-payments-panel";
import {
  ServiceDetailModal,
  type ServiceDetailModalEntry,
} from "./servicos/_components/service-detail-modal";

// TODO: revert mocks when payments API is ready
const mockCards: RegisteredCard[] = [
  // { id: 1, brandSrc: "/icons/master-card-icon.svg", lastDigits: "0123", expiry: "01/30" },
  // { id: 2, brandSrc: "/icons/master-card-icon.svg", lastDigits: "0123", expiry: "01/30" },
];

const mockPayments: RecentPayment[] = [
  // {
  //   id: 1,
  //   method: "card",
  //   methodLabel: "Terminado em 0123",
  //   service: "Faxina Regular",
  //   amount: "R$ 57,00",
  //   status: "approved",
  //   statusLabel: "Aprovado",
  // },
  // {
  //   id: 2,
  //   method: "card",
  //   methodLabel: "Terminado em 0123",
  //   service: "Faxina Pós-Obra",
  //   amount: "R$ 57,00",
  //   status: "pending",
  //   statusLabel: "Pendente",
  // },
  // {
  //   id: 3,
  //   method: "pix",
  //   methodLabel: "PIX",
  //   service: "Faxina Pós-Obra",
  //   amount: "R$ 53,00",
  //   status: "pending",
  //   statusLabel: "Pendente",
  // },
];

export default function DashboardPage() {
  const { summary, isLoading } = useDashboardStore();
  const [selectedEntry, setSelectedEntry] = useState<ServiceDetailModalEntry | null>(null);

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
          onViewEntry={(entry) => setSelectedEntry(entry)}
        />
      </div>

      <div className="flex w-125.25 shrink-0 flex-col gap-6">
        <DsDiscountCard className="h-33">
          <span>
            Agende agora serviços recorrentes semanais e ganhe{" "}
            <span className="font-semibold">10% de desconto</span>
          </span>
        </DsDiscountCard>

        <DashboardPaymentsPanel
          cards={mockCards}
          payments={mockPayments}
          paymentsMonthLabel="Este mês"
        />
      </div>
      <ServiceDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}
