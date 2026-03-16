"use client";

import { DsFormField, DsSelect } from "@/design-system";
import {
  useAdminCreateAppointmentStore,
  DURATION_OPTIONS,
} from "@/stores/admin-create-appointment-store";
import { RECURRENCE_LABELS } from "@/lib/appointment-labels";

function ServiceInfoCard() {
  const {
    serviceId,
    recurrenceType,
    duration,
    serviceOptions,
    setServiceId,
    setRecurrenceType,
    setDuration,
  } = useAdminCreateAppointmentStore();

  const serviceSelectOptions = serviceOptions.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  const selectedService = serviceOptions.find((s) => String(s.id) === serviceId);

  const recurrenceOptions = [
    ...(selectedService?.allowSingle !== false
      ? [{ value: "SINGLE", label: RECURRENCE_LABELS.SINGLE }]
      : []),
    ...(selectedService?.allowPackage
      ? [{ value: "PACKAGE", label: RECURRENCE_LABELS.PACKAGE }]
      : []),
    ...(selectedService?.allowRecurrence
      ? [
          { value: "WEEKLY", label: RECURRENCE_LABELS.WEEKLY },
          { value: "BIWEEKLY", label: RECURRENCE_LABELS.BIWEEKLY },
          { value: "MONTHLY", label: RECURRENCE_LABELS.MONTHLY },
        ]
      : []),
  ];

  const durationSelectOptions = DURATION_OPTIONS.map((d) => ({
    value: String(d.value),
    label: d.label,
  }));

  return (
    <div className="flex w-125 shrink-0 flex-col gap-6 rounded-[10px] border border-nova-gray-100 bg-white p-6">
      <p className="text-xl font-medium leading-[1.3] text-black">Informações do serviço</p>
      <div className="flex flex-col gap-6">
        <DsFormField label="Tipo de Serviço">
          <DsSelect
            options={serviceSelectOptions}
            value={serviceId}
            onValueChange={setServiceId}
            placeholder="Selecione o serviço"
          />
        </DsFormField>
        <DsFormField label="Pacote">
          <DsSelect
            options={recurrenceOptions}
            value={recurrenceType}
            onValueChange={(v) =>
              setRecurrenceType(v as "SINGLE" | "PACKAGE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY")
            }
            placeholder="Selecione o pacote"
          />
        </DsFormField>
        <DsFormField label="Duração">
          <DsSelect
            options={durationSelectOptions}
            value={duration}
            onValueChange={setDuration}
            placeholder="Selecione a duração"
          />
        </DsFormField>
      </div>
    </div>
  );
}

export { ServiceInfoCard };
