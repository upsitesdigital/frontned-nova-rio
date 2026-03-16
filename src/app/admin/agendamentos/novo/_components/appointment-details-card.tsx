"use client";

import { DsFormField, DsSelect, DsInput, DsTextarea } from "@/design-system";
import { useAdminCreateAppointmentStore } from "@/stores/admin-create-appointment-store";

function AppointmentDetailsCard() {
  const {
    clientId,
    employeeId,
    locationZip,
    notes,
    clientOptions,
    employeeOptions,
    employeeConflict,
    setClientId,
    setEmployeeId,
    setLocationZip,
    setNotes,
  } = useAdminCreateAppointmentStore();

  const clientSelectOptions = clientOptions.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const employeeSelectOptions = [
    { value: "none", label: "Sem funcionário" },
    ...employeeOptions.map((e) => ({
      value: String(e.id),
      label: e.name,
    })),
  ];

  return (
    <div className="flex w-125 shrink-0 flex-col gap-6 rounded-[10px] border border-nova-gray-100 bg-white p-6">
      <p className="text-xl font-medium leading-[1.3] text-black">Detalhes do agendamento</p>
      <div className="flex flex-col gap-6">
        <DsFormField label="Cliente">
          <DsSelect
            options={clientSelectOptions}
            value={clientId}
            onValueChange={setClientId}
            placeholder="Selecione o cliente"
          />
        </DsFormField>
        <DsFormField label="Funcionário" error={employeeConflict ?? undefined} errorVariant="pill">
          <DsSelect
            options={employeeSelectOptions}
            value={employeeId}
            onValueChange={setEmployeeId}
            placeholder="Selecione o funcionário"
            error={!!employeeConflict}
          />
        </DsFormField>
        <DsFormField label="Local da limpeza">
          <DsInput
            type="text"
            placeholder="Digite seu CEP"
            value={locationZip}
            onChange={(e) => setLocationZip(e.target.value)}
          />
        </DsFormField>
        <DsFormField label="Observações">
          <DsTextarea
            placeholder="Observações especiais para o serviço"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-25"
          />
        </DsFormField>
      </div>
    </div>
  );
}

export { AppointmentDetailsCard };
