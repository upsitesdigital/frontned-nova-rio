"use client";

import { ClockIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsFormCard,
  DsFormField,
  DsInput,
  DsMetricCard,
  DsTextarea,
  DsIcon,
  DsSelect,
} from "@/design-system";
import { useAdminEmployeeEditStore } from "@/stores/admin-employee-edit-store";

function ServicesSection() {
  const form = useAdminEmployeeEditStore((s) => s.form);
  const updateField = useAdminEmployeeEditStore((s) => s.updateField);
  const unitOptions = useAdminEmployeeEditStore((s) => s.unitOptions);

  return (
    <DsFormCard title="Serviços">
      <DsMetricCard label="Horas trabalhadas/ Semana" value={form.weeklyHours || "–"} />

      <div className="flex flex-col gap-6">
        <DsFormField label="Disponibilidade">
          <div className="flex gap-4">
            <div className="flex flex-1 items-center gap-1 rounded-[6px] border border-nova-gray-200 px-4 py-3">
              <DsIcon icon={ClockIcon} size="md" className="shrink-0 text-nova-gray-700" />
              <DsInput
                value={form.availabilityFrom}
                onChange={(e) => updateField("availabilityFrom", e.target.value)}
                placeholder="07:00"
                className="border-0 p-0 shadow-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-1 rounded-[6px] border border-nova-gray-200 px-4 py-3">
              <DsIcon icon={ClockIcon} size="md" className="shrink-0 text-nova-gray-700" />
              <DsInput
                value={form.availabilityTo}
                onChange={(e) => updateField("availabilityTo", e.target.value)}
                placeholder="18:00"
                className="border-0 p-0 shadow-none"
              />
            </div>
          </div>
        </DsFormField>

        <DsFormField label="Unidade">
          {unitOptions.length > 0 ? (
            <DsSelect
              key={form.unitId ?? "empty"}
              options={unitOptions.map((u) => ({ value: String(u.id), label: u.name }))}
              value={form.unitId ? String(form.unitId) : undefined}
              onValueChange={(v) => updateField("unitId", Number(v))}
              placeholder="Selecione uma unidade"
            />
          ) : (
            <DsInput disabled placeholder="Carregando..." />
          )}
        </DsFormField>

        <DsFormField label="Observações">
          <DsTextarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={5}
          />
        </DsFormField>
      </div>
    </DsFormCard>
  );
}

export { ServicesSection };
