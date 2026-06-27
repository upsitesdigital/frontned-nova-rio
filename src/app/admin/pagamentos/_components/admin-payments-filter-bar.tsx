"use client";

import { DsFilterDropdown, type DsFilterDropdownOption } from "@/design-system";
import { useAdminPaymentsStore } from "@/stores/admin/admin-payments-store";

const statusOptions: DsFilterDropdownOption[] = [
  { value: "all", label: "Todos" },
  { value: "APPROVED", label: "Aprovado" },
  { value: "PENDING", label: "Pendente" },
  { value: "CANCELLED", label: "Cancelado" },
];

export function AdminPaymentsFilterBar() {
  const { statusFilter, setStatusFilter } = useAdminPaymentsStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-xl font-medium leading-[1.3] text-black">
        Histórico completo de transações
      </p>

      <div className="flex items-center gap-3">
        <DsFilterDropdown
          label="Filtrar por"
          options={statusOptions}
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          placeholder="Todos"
        />
      </div>
    </div>
  );
}
