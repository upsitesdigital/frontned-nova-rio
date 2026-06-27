"use client";

import { DsSearchInput, DsToggleButton } from "@/design-system";
import { useAdminEmployeesStore, type StatusFilter } from "@/stores/admin/admin-employees-store";

const statusButtons: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "ACTIVE", label: "Ativos" },
  { value: "INACTIVE", label: "Inativos" },
];

export function EmployeesFilterBar() {
  const statusFilter = useAdminEmployeesStore((s) => s.statusFilter);
  const searchQuery = useAdminEmployeesStore((s) => s.searchQuery);
  const setStatusFilter = useAdminEmployeesStore((s) => s.setStatusFilter);
  const setSearchQuery = useAdminEmployeesStore((s) => s.setSearchQuery);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12">
        <p className="text-xl font-medium leading-[1.3] text-black">Funcionários</p>
        <div className="flex flex-wrap items-start gap-4">
          {statusButtons.map((btn) => (
            <DsToggleButton
              key={btn.value}
              label={btn.label}
              active={statusFilter === btn.value}
              onClick={() => setStatusFilter(btn.value)}
            />
          ))}
        </div>
      </div>

      <DsSearchInput
        placeholder="Pesquisar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full lg:w-86.5"
      />
    </div>
  );
}
