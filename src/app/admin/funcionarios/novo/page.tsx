"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClockIcon, FloppyDiskIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsAvatar,
  DsButton,
  DsFormCard,
  DsFormField,
  DsIcon,
  DsInput,
  DsPageHeader,
  DsSelect,
  DsTextarea,
} from "@/design-system";
import { Formatters } from "@/lib/formatting/formatters";
import { useAdminEmployeeCreateStore } from "@/stores/admin/admin-employee-create-store";

export default function AdminEmployeeCreatePage() {
  const router = useRouter();
  const { form, isSaving, unitOptions, loadUnits, updateField, createEmployee, reset } =
    useAdminEmployeeCreateStore();

  useEffect(() => {
    loadUnits();
    return () => reset();
  }, [loadUnits, reset]);

  const handleSave = async () => {
    const success = await createEmployee();
    if (success) {
      router.push("/admin/funcionarios");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DsPageHeader
        title="Novo funcionário"
        subtitle="Cadastre um novo funcionário na plataforma."
        onBack={() => router.push("/admin/funcionarios")}
        action={
          <DsButton variant="default" size="flow" disabled={isSaving} onClick={handleSave}>
            <DsIcon icon={FloppyDiskIcon} size="lg" className="text-white" />
            Salvar
          </DsButton>
        }
      />

      <div className="flex flex-col items-start gap-4 xl:flex-row">
        {/* Personal Info */}
        <div className="w-full xl:w-157.75 xl:shrink-0">
          <DsFormCard title="Informações pessoais">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <DsAvatar
                  fallback={form.name.charAt(0).toUpperCase() || "?"}
                  size="xl"
                  variant="brand"
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
                <DsInput
                  value={form.phone}
                  onChange={(e) => updateField("phone", Formatters.formatPhone(e.target.value))}
                />
              </DsFormField>

              <DsFormField label="CPF">
                <DsInput
                  value={form.cpf}
                  onChange={(e) => updateField("cpf", Formatters.formatCpfCnpj(e.target.value))}
                />
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
        </div>

        {/* Services/Availability */}
        <div className="w-full xl:w-125 xl:shrink-0">
          <DsFormCard title="Serviços">
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
        </div>
      </div>
    </div>
  );
}
