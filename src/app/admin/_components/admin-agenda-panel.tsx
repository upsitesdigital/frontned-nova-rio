"use client";

import {
  DsFilterDropdown,
  DsServiceHistoryItem,
  DsEmptyState,
  DsPagination,
} from "@/design-system";
import { formatShortDate } from "@/lib/date-helpers";
import { useAdminAgendaStore, AGENDA_PAGE_SIZE } from "@/stores/admin-agenda-store";

function AdminAgendaPanel() {
  const {
    agendaItems,
    agendaTotal,
    agendaPage,
    agendaServiceFilter,
    isAgendaLoading,
    serviceOptions,
    setAgendaPage,
    setAgendaServiceFilter,
  } = useAdminAgendaStore();

  const totalPages = Math.max(1, Math.ceil(agendaTotal / AGENDA_PAGE_SIZE));

  const filterOptions = [
    { value: "all", label: "Todos" },
    ...serviceOptions.map((s) => ({ value: String(s.id), label: s.name })),
  ];

  return (
    <div className="flex flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium leading-[1.3] text-black">Agenda do dia</p>
        <DsFilterDropdown
          label="Filtrar por"
          options={filterOptions}
          value={agendaServiceFilter}
          onValueChange={setAgendaServiceFilter}
          placeholder="Todos"
        />
      </div>

      {isAgendaLoading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-base text-nova-gray-400">Carregando agenda...</p>
        </div>
      ) : agendaItems.length === 0 ? (
        <DsEmptyState message="Nenhum agendamento para hoje." />
      ) : (
        <div className="flex flex-col gap-4 rounded-[10px] bg-nova-gray-50 p-6">
          <div className="flex flex-col">
            {agendaItems.map((entry) => (
              <DsServiceHistoryItem
                key={entry.appointmentId}
                date={formatShortDate(entry.date)}
                clientName={entry.clientName}
                label={entry.serviceName}
              />
            ))}
          </div>
          <DsPagination
            currentPage={agendaPage}
            totalPages={totalPages}
            totalItems={agendaTotal}
            pageSize={AGENDA_PAGE_SIZE}
            onPageChange={setAgendaPage}
          />
        </div>
      )}
    </div>
  );
}

export { AdminAgendaPanel };
