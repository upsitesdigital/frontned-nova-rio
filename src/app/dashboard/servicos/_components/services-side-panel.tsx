"use client";

import { useEffect } from "react";

import {
  DsUpcomingServiceCard,
  DsHighlightCard,
  DsRecurrenceCard,
  DsSelect,
  DsSchedulePopup,
  DsCancelConfirmPopup,
} from "@/design-system";
import { AppointmentRules } from "@/lib/core/appointment-rules";
import { AppointmentDateTimeFormat } from "@/lib/display/appointment-datetime-format";
import type { RecurrenceFrequencyCode } from "@/api/client/profile-api";
import { useRecurrencePreferenceStore } from "@/stores/client/recurrence-preference-store";
import { useSidePanelRescheduleStore } from "@/stores/client/side-panel-reschedule-store";
import { useToastStore } from "@/stores/ui/toast-store";

export interface ServicesSidePanelProps {
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

const recurrenceOptions = [
  { value: "MONTHLY", label: "Mensal" },
  { value: "BIWEEKLY", label: "Quinzenal" },
  { value: "WEEKLY", label: "Semanal" },
];

export function ServicesSidePanel({
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
  const preferredRecurrence = useRecurrencePreferenceStore((s) => s.preferredRecurrence);
  const loadPreference = useRecurrencePreferenceStore((s) => s.loadPreference);
  const savePreference = useRecurrencePreferenceStore((s) => s.savePreference);

  useEffect(() => {
    loadPreference();
  }, [loadPreference]);
  const {
    rescheduleOpen,
    rescheduleDate,
    rescheduleTime,
    cancelOpen,
    isSaving,
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
    <div className="flex w-full shrink-0 flex-col gap-4 xl:w-125">
      <DsUpcomingServiceCard
        title="Próximo serviço"
        date={nextServiceDate}
        subtitle={nextServiceSubtitle}
        onReceipt={onReceipt}
        receiptDisabled={!onReceipt}
        actions={[
          {
            label: "Reagendar",
            variant: "filled",
            disabled: !hasNextService || AppointmentRules.isCancelBlocked(nextAppointmentDateTime),
            onClick: () =>
              openReschedule(
                nextAppointmentDateTime ? new Date(nextAppointmentDateTime) : undefined,
                AppointmentDateTimeFormat.extractTimeFromDateTime(nextAppointmentDateTime),
              ),
          },
          {
            label: "Cancelar",
            variant: "outlined",
            disabled: !hasNextService || AppointmentRules.isCancelBlocked(nextAppointmentDateTime),
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
            value={preferredRecurrence ?? "MONTHLY"}
            onValueChange={(value) => savePreference(value as RecurrenceFrequencyCode)}
            className="w-full gap-1 rounded-md border-nova-gray-100 bg-white px-4 py-3 text-base leading-normal tracking-[-0.64px] text-nova-gray-600 shadow-none data-[size=default]:h-auto"
          />
        </div>
        <p className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
          Quanto mais visitas você agenda no mês, maior o desconto:
          <ul className="mt-1 list-disc pl-4">
            <li>1 visita: sem desconto</li>
            <li>2 visitas: 3% de desconto</li>
            <li>4 visitas: 5% de desconto</li>
            <li>8 visitas: 7% de desconto</li>
            <li>13 visitas: 8% de desconto</li>
            <li>17 visitas: 9% de desconto</li>
            <li>21 visitas: até 10% de desconto</li>
          </ul>
        </p>
      </DsRecurrenceCard>

      <DsSchedulePopup
        closeLabel="Fechar"
        title="Escolher data e horário"
        cancelLabel="Cancelar"
        confirmLabel="Ok"
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
        confirmDisabled={isSaving}
      />

      <DsCancelConfirmPopup
        closeLabel="Fechar"
        description="Cancelamento com 1h de antecedência"
        title="Deseja cancelar o serviço?"
        confirmLabel="Sim, cancelar"
        cancelLabel="Manter agendamento"
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
        confirmDisabled={isSaving}
      />
    </div>
  );
}
