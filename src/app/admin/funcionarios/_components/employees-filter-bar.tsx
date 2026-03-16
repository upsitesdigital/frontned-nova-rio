"use client";

import { DsSearchInput, DsToggleButton } from "@/design-system";
import { useAdminEmployeesStore, type StatusFilter } from "@/stores/admin-employees-store";

const STATUS_BUTTONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "ACTIVE", label: "Ativos" },
  { value: "INACTIVE", label: "Inativos" },
];

function EmployeesFilterBar() {
  const statusFilter = useAdminEmployeesStore((s) => s.statusFilter);
  const searchQuery = useAdminEmployeesStore((s) => s.searchQuery);
  const setStatusFilter = useAdminEmployeesStore((s) => s.setStatusFilter);
  const setSearchQuery = useAdminEmployeesStore((s) => s.setSearchQuery);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-12">
        <p className="text-xl font-medium leading-[1.3] text-black">Funcionários</p>
        <div className="flex items-start gap-4">
          {STATUS_BUTTONS.map((btn) => (
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
        className="w-86.5"
      />
    </div>
  );
}

export { EmployeesFilterBar };
