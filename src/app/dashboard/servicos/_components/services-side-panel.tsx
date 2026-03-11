"use client";

import {
  DsUpcomingServiceCard,
  DsHighlightCard,
  DsRecurrenceCard,
  DsSelect,
  DsSchedulePopup,
} from "@/design-system";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useSidePanelRescheduleStore } from "@/stores/side-panel-reschedule-store";

interface ServicesSidePanelProps {
  nextServiceDate: string;
  nextServiceSubtitle: string;
  nextAppointmentId: number | null;
  appointmentsCount: number;
  appointmentsLabel: string;
  hasNextService: boolean;
  onChanged?: () => void;
  onReceipt?: () => void;
}

const recurrenceOptions = [
  { value: "monthly", label: "Mensal" },
  { value: "biweekly", label: "Quinzenal" },
  { value: "weekly", label: "Semanal" },
];

function ServicesSidePanel({
  nextServiceDate,
  nextServiceSubtitle,
  nextAppointmentId,
  appointmentsCount,
  appointmentsLabel,
  hasNextService,
  onChanged,
  onReceipt,
}: ServicesSidePanelProps) {
  const { sidePanelRecurrenceType, setSidePanelRecurrenceType } = useDashboardStore();
  const {
    rescheduleOpen,
    rescheduleDate,
    rescheduleTime,
    openReschedule,
    closeReschedule,
    setRescheduleDate,
    setRescheduleTime,
    confirmReschedule,
    cancelAppointment,
  } = useSidePanelRescheduleStore();

  return (
    <div className="flex w-125 shrink-0 flex-col gap-4">
      <DsUpcomingServiceCard
        date={nextServiceDate}
        subtitle={nextServiceSubtitle}
        onReceipt={onReceipt}
        receiptDisabled={!hasNextService}
        actions={[
          { label: "Reagendar", variant: "filled", onClick: openReschedule },
          {
            label: "Cancelar",
            variant: "outlined",
            onClick: async () => {
              if (!nextAppointmentId) return;
              const success = await cancelAppointment(nextAppointmentId);
              if (success) onChanged?.();
            },
          },
        ]}
      />

      <DsHighlightCard
        title="Agendamentos"
        value={String(appointmentsCount)}
        subtitle={appointmentsLabel}
        valueColor="text-nova-primary-dark"
      />

      <DsRecurrenceCard
        title="Configurar Recorrência"
        description="Escolha como deseja configurar a recorrência dos serviços"
      >
        <div className="flex flex-col gap-1.5">
          <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
            Selecione o tipo de recorrência
          </p>
          <DsSelect
            options={recurrenceOptions}
            value={sidePanelRecurrenceType}
            onValueChange={setSidePanelRecurrenceType}
            className="w-full gap-1 rounded-md border-nova-gray-100 bg-white px-4 py-3 text-base leading-normal tracking-[-0.64px] text-[#4d4d4f] shadow-none data-[size=default]:h-auto"
          />
        </div>
        <p className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
          <span className="font-bold">5%</span> de desconto para recorrências mensais e{" "}
          <span className="font-bold">10%</span> para semanais e quinzenais.
        </p>
      </DsRecurrenceCard>

      <DsSchedulePopup
        open={rescheduleOpen}
        date={rescheduleDate}
        time={rescheduleTime}
        onDateChange={setRescheduleDate}
        onTimeChange={setRescheduleTime}
        onCancel={closeReschedule}
        onClose={closeReschedule}
        onConfirm={async () => {
          if (!nextAppointmentId) return;
          const success = await confirmReschedule(nextAppointmentId);
          if (success) onChanged?.();
        }}
      />
    </div>
  );
}

export { ServicesSidePanel, type ServicesSidePanelProps };
