"use client";

import { DsAvatar, DsButton, DsFormCard, DsFormField, DsInput, DsSelect } from "@/design-system";
import { useAdminEmployeeEditStore } from "@/stores/admin-employee-edit-store";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
];

function PersonalInfoSection() {
  const form = useAdminEmployeeEditStore((s) => s.form);
  const updateField = useAdminEmployeeEditStore((s) => s.updateField);

  return (
    <DsFormCard title="Informações pessoais">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DsAvatar fallback={form.name.charAt(0).toUpperCase() || "?"} size="xl" variant="brand" />
          <DsButton variant="soft" size="soft-md">
            Alterar imagem
          </DsButton>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-base font-medium leading-[1.3] text-nova-gray-700">Status</span>
          <DsSelect
            options={STATUS_OPTIONS}
            value={form.status}
            onValueChange={(v) => updateField("status", v)}
            className="w-30"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <DsFormField label="Nome">
          <DsInput value={form.name} onChange={(e) => updateField("name", e.target.value)} />
        </DsFormField>

        <DsFormField label="E-mail">
          <DsInput
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </DsFormField>

        <DsFormField label="Telefone">
          <DsInput value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
        </DsFormField>

        <DsFormField label="CPF">
          <DsInput value={form.cpf} onChange={(e) => updateField("cpf", e.target.value)} />
        </DsFormField>

        <DsFormField label="Endereço">
          <DsInput
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="-"
          />
        </DsFormField>
      </div>
    </DsFormCard>
  );
}

export { PersonalInfoSection };
