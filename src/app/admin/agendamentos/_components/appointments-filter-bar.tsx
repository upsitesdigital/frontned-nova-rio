"use client";

import { DsFilterDropdown, DsToggleButton } from "@/design-system";
import { useAdminAppointmentsStore, type ViewMode } from "@/stores/admin/admin-appointments-store";
import { AppointmentLabels } from "@/lib/display/appointment-labels";

const viewModeButtons: { value: ViewMode; label: string }[] = [
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
    ...Object.entries(AppointmentLabels.statusLabels).map(([value, label]) => ({ value, label })),
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
          {viewModeButtons.map((btn) => (
            <DsToggleButton
              key={btn.value}
              label={btn.label}
              active={viewMode === btn.value}
              onClick={() => setViewMode(btn.value)}
              className="cursor-pointer"
            />
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
