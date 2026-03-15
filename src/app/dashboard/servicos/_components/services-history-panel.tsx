"use client";

import { useMemo } from "react";
import {
  DsFilterDropdown,
  DsServiceHistoryItem,
  DsPagination,
  DsEmptyState,
} from "@/design-system";
import {
  useServicesHistoryStore,
  type ServiceHistoryFilter,
} from "@/stores/services-history-store";
import type { ServiceHistoryEntry, ServiceHistoryMonth } from "@/api/dashboard-api";

interface ServicesHistoryPanelProps {
  months: ServiceHistoryMonth[];
  onViewEntry?: (entry: ServiceHistoryEntry) => void;
  onEditEntry?: (id: number) => void;
}

const PAGE_SIZE = 10;

const filterOptions = [
  { value: "all", label: "Todos" },
  { value: "recurrence", label: "Recorrência" },
  { value: "one_time", label: "Avulso" },
];

function ServicesHistoryPanel({ months, onViewEntry, onEditEntry }: ServicesHistoryPanelProps) {
  const { filter, currentPage, setFilter, setCurrentPage } = useServicesHistoryStore();

  const allEntries = useMemo(
    () => months.flatMap((m) => m.entries.map((e) => ({ ...e, monthLabel: m.monthLabel }))),
    [months],
  );

  const totalItems = allEntries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedEntries = allEntries.slice(startIndex, startIndex + PAGE_SIZE);

  const groupedByMonth = useMemo(() => {
    const groups: {
      monthLabel: string;
      entries: (ServiceHistoryEntry & { monthLabel: string })[];
    }[] = [];
    for (const entry of paginatedEntries) {
      const last = groups[groups.length - 1];
      if (last && last.monthLabel === entry.monthLabel) {
        last.entries.push(entry);
      } else {
        groups.push({ monthLabel: entry.monthLabel, entries: [entry] });
      }
    }
    return groups;
  }, [paginatedEntries]);

  return (
    <div className="flex flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium leading-[1.3] text-black">Histórico de serviços</p>
        <DsFilterDropdown
          label="Filtrar por"
          options={filterOptions}
          value={filter}
          onValueChange={(v) => setFilter(v as ServiceHistoryFilter)}
          placeholder="Todos"
        />
      </div>

      {months.length === 0 ? (
        <DsEmptyState message="Nenhum serviço registrado ainda." />
      ) : (
        <div className="flex flex-col gap-4 rounded-[10px] bg-nova-gray-50 p-6">
          {groupedByMonth.map((group) => (
            <div key={group.monthLabel} className="flex flex-col gap-4">
              <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                {group.monthLabel}
              </p>
              <div className="flex flex-col">
                {group.entries.map((entry) => (
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
          ))}
          <DsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export {
  ServicesHistoryPanel,
  type ServicesHistoryPanelProps,
  type ServiceHistoryMonth,
  type ServiceHistoryEntry,
};
