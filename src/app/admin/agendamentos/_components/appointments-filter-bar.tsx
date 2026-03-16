"use client";

import { cn } from "@/lib/utils";
import { DsFilterDropdown } from "@/design-system";
import {
  useAdminAppointmentsStore,
  type ViewMode,
} from "@/stores/admin-appointments-store";
import { STATUS_LABELS } from "@/lib/appointment-labels";

const VIEW_MODE_BUTTONS: { value: ViewMode; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "week", label: "Semana" },
  { value: "employee", label: "Funcionário" },
  { value: "unit", label: "Unidade" },
];

function AppointmentsFilterBar() {
  const {
    viewMode,
    statusFilter,
    employeeFilter,
    unitFilter,
    employeeOptions,
    unitOptions,
    setViewMode,
    setStatusFilter,
    setEmployeeFilter,
    setUnitFilter,
  } = useAdminAppointmentsStore();

  const statusFilterOptions = [
    { value: "all", label: "Todos" },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const employeeFilterOptions = [
    { value: "all", label: "Todos" },
    ...employeeOptions.map((e) => ({ value: String(e.id), label: e.name })),
  ];

  const unitFilterOptions = [
    { value: "all", label: "Todas" },
    ...unitOptions.map((u) => ({ value: String(u.id), label: u.name })),
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-12">
        <p className="text-xl font-medium leading-[1.3] text-black">Agenda de serviços</p>
        <div className="flex items-start gap-4">
          {VIEW_MODE_BUTTONS.map((btn) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => setViewMode(btn.value)}
              className={cn(
                "cursor-pointer rounded-[10px] px-4 py-2.5 text-base font-medium leading-[1.3] text-nova-gray-700",
                viewMode === btn.value
                  ? "bg-nova-gray-100"
                  : "border border-nova-gray-200 bg-transparent",
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {viewMode === "employee" && (
          <DsFilterDropdown
            label="Funcionário"
            options={employeeFilterOptions}
            value={employeeFilter}
            onValueChange={setEmployeeFilter}
            placeholder="Todos"
          />
        )}
        {viewMode === "unit" && (
          <DsFilterDropdown
            label="Unidade"
            options={unitFilterOptions}
            value={unitFilter}
            onValueChange={setUnitFilter}
            placeholder="Todas"
          />
        )}
        <DsFilterDropdown
          label="Filtrar por"
          options={statusFilterOptions}
          value={statusFilter}
          onValueChange={setStatusFilter}
          placeholder="Todos"
        />
      </div>
    </div>
  );
}

export { AppointmentsFilterBar };
