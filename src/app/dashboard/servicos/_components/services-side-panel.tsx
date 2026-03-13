"use client";

import {
  DsUpcomingServiceCard,
  DsHighlightCard,
  DsRecurrenceCard,
  DsSelect,
  DsSchedulePopup,
  DsCancelConfirmPopup,
} from "@/design-system";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useSidePanelRescheduleStore } from "@/stores/side-panel-reschedule-store";
import { useToastStore } from "@/stores/toast-store";

interface ServicesSidePanelProps {
  nextServiceDate: string;
  nextServiceSubtitle: string;
  nextAppointmentId: number | null;
  nextAppointmentDateTime: string | null;
  appointmentsCount: number;
  appointmentsLabel: string;
  hasNextService: boolean;
  onChanged?: () => void;
  onReceipt?: () => void;
}

const CANCELLATION_WINDOW_MS = 60 * 60 * 1000;

function isCancelBlocked(dateTime: string | null): boolean {
  if (!dateTime) return true;
  const appointmentTime = new Date(dateTime).getTime();
  return appointmentTime - Date.now() < CANCELLATION_WINDOW_MS;
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
  nextAppointmentDateTime,
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
    cancelOpen,
    openReschedule,
    closeReschedule,
    setRescheduleDate,
    setRescheduleTime,
    confirmReschedule,
    openCancel,
    closeCancel,
    confirmCancel,
  } = useSidePanelRescheduleStore();
  const showToast = useToastStore((s) => s.showToast);

  return (
    <div className="flex w-125 shrink-0 flex-col gap-4">
      <DsUpcomingServiceCard
        date={nextServiceDate}
        subtitle={nextServiceSubtitle}
        onReceipt={onReceipt}
        receiptDisabled={!hasNextService}
        actions={[
          {
            label: "Reagendar",
            variant: "filled",
            onClick: () =>
              openReschedule(
                nextAppointmentDateTime ? new Date(nextAppointmentDateTime) : undefined,
                nextAppointmentDateTime ? nextAppointmentDateTime.slice(11, 16) : undefined,
              ),
          },
          {
            label: "Cancelar",
            variant: "outlined",
            disabled: isCancelBlocked(nextAppointmentDateTime),
            onClick: openCancel,
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
          if (success) {
            showToast("Agendamento atualizado com sucesso!");
            onChanged?.();
          }
        }}
      />

      <DsCancelConfirmPopup
        open={cancelOpen}
        onCancel={closeCancel}
        onClose={closeCancel}
        onConfirm={async () => {
          if (!nextAppointmentId) return;
          const success = await confirmCancel(nextAppointmentId);
          if (success) {
            showToast("Agendamento cancelado com sucesso!");
            onChanged?.();
          }
        }}
      />
    </div>
  );
}

export { ServicesSidePanel, type ServicesSidePanelProps };
