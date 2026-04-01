"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { DsDiscountCard, DsHighlightCard } from "@/design-system";
import { getCurrentMonthLabel } from "@/lib/date-helpers";
import { mapCardsToPanel, mapPaymentsToPanel } from "@/lib/dashboard-payments-mapper";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useDashboardPaymentsStore } from "@/stores/dashboard-payments-store";
import { useAddressStore } from "@/stores/address-store";
import { useSchedulingStore } from "@/stores/scheduling-store";
import { useServicesStore } from "@/stores/services-store";
import { usePaymentStore } from "@/stores/payment-store";
import { useConfirmationStore } from "@/stores/confirmation-store";
import { DashboardServiceHistory } from "./_components/dashboard-service-history";
import { DashboardPaymentsPanel } from "./_components/dashboard-payments-panel";
import { ServiceDetailModal } from "./servicos/_components/service-detail-modal";

export default function DashboardPage() {
  const router = useRouter();
  const { summary, isLoading, error, selectedDetailEntry, setSelectedDetailEntry } =
    useDashboardStore();
  const { cards, recentPayments } = useDashboardPaymentsStore();

  const handleStartScheduling = () => {
    useServicesStore.getState().reset();
    useSchedulingStore.getState().reset();
    useAddressStore.getState().reset();
    usePaymentStore.getState().reset();
    useConfirmationStore.getState().reset();
    router.push("/dashboard/agendamento/servico");
  };

  const hasScheduledServices =
    (summary?.appointmentsCount ?? 0) > 0 ||
    (summary?.serviceHistory?.some((month) => month.entries.length > 0) ?? false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-base text-nova-gray-400">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-base text-nova-error">{error}</p>
      </div>
    );
  }

  if (!hasScheduledServices) {
    return (
      <div className="flex min-h-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-semibold leading-[1.3] tracking-[-1.92px] text-black">
            Olá, {summary?.clientName ?? ""}
          </h1>
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            Sua limpeza pay per use para escritórios e consultórios de alto padrão.
          </p>
        </div>

        <section className="relative flex h-123.5 w-full flex-col items-center justify-center gap-10 overflow-hidden rounded-[10px] bg-white px-6 text-center">
          <div className="flex max-w-383.75 flex-col items-center gap-4">
            <h2 className="max-w-116.75 text-[36px] leading-[1.3] font-medium tracking-[-1.44px] text-black">
              Voce ainda nao possui nenhuma limpeza agendada
            </h2>
            <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
              Agende agora mesmo e aproveite sua limpeza empresarial sob demanda!
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartScheduling}
            className="flex h-14 items-center justify-center gap-1 rounded-xl bg-nova-primary px-8 py-4"
          >
            <PlusIcon size={24} className="text-white" />
            <span className="text-lg leading-normal font-medium tracking-[-0.72px] text-white">
              Agendar servico
            </span>
          </button>

          <div className="pointer-events-none absolute bottom-0 left-0 h-37.5 w-111 overflow-hidden">
            <div className="absolute -bottom-36 -left-64 h-97 w-173.5 rounded-[50%] border-4 border-nova-primary" />
            <div className="absolute -bottom-32 -left-60 h-90 w-167 rounded-[50%] border border-nova-primary" />
          </div>
        </section>
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

        <DashboardPaymentsPanel
          cards={mapCardsToPanel(cards)}
          payments={mapPaymentsToPanel(recentPayments)}
          paymentsMonthLabel={getCurrentMonthLabel()}
        />
      </div>
      <ServiceDetailModal
        entry={selectedDetailEntry}
        onClose={() => setSelectedDetailEntry(null)}
      />
    </div>
  );
}
