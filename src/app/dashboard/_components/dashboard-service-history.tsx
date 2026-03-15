"use client";

import { DsFilterDropdown, DsServiceHistoryItem, DsEmptyState } from "@/design-system";
import { useDashboardStore } from "@/stores/dashboard-store";
import type { ServiceHistoryEntry, ServiceHistoryMonth } from "@/api/dashboard-api";

interface DashboardServiceHistoryProps {
  months: ServiceHistoryMonth[];
  onViewEntry?: (entry: ServiceHistoryEntry) => void;
  onEditEntry?: (id: number) => void;
}

const filterOptions = [
  { value: "recent", label: "Mais recentes" },
  { value: "recurrence", label: "Recorrência" },
  { value: "one_time", label: "Avulso" },
];

function DashboardServiceHistory({
  months,
  onViewEntry,
  onEditEntry,
}: DashboardServiceHistoryProps) {
  const { serviceHistoryFilter, setServiceHistoryFilter } = useDashboardStore();

  return (
    <div className="flex flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium leading-[1.3] text-black">Histórico de serviços</p>
        <DsFilterDropdown
          label="Filtrar por"
          options={filterOptions}
          value={serviceHistoryFilter}
          onValueChange={setServiceHistoryFilter}
          placeholder="Mais recentes"
        />
      </div>

      {months.length === 0 ? (
        <DsEmptyState message="Nenhum serviço registrado ainda." />
      ) : (
        months.map((month) => (
          <div
            key={month.monthLabel}
            className="flex flex-col gap-4 rounded-[10px] bg-nova-gray-50 p-6"
          >
            <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
              {month.monthLabel}
            </p>
            <div className="flex flex-col">
              {month.entries.map((entry) => (
                <DsServiceHistoryItem
                  key={entry.id}
                  date={entry.date}
                  label={entry.label}
                  onView={onViewEntry ? () => onViewEntry(entry) : undefined}
                  onEdit={entry.canEdit && onEditEntry ? () => onEditEntry(entry.id) : undefined}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export {
  DashboardServiceHistory,
  type DashboardServiceHistoryProps,
  type ServiceHistoryEntry,
  type ServiceHistoryMonth,
};
