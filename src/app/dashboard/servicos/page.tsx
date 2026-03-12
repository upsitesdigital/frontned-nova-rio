"use client";

import { useCallback } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { ServicesHistoryPanel } from "./_components/services-history-panel";
import { ServicesSidePanel } from "./_components/services-side-panel";
import { ServiceDetailModal } from "./_components/service-detail-modal";
import { ServiceEditDrawer } from "./_components/service-edit-drawer";

export default function ServicesPage() {
  const {
    summary,
    isLoading,
    selectedDetailEntry,
    setSelectedDetailEntry,
    editEntry,
    setEditEntry,
    loadSummary,
  } = useDashboardStore();

  const handleEditEntry = useCallback(
    (id: number) => {
      const entries = summary?.serviceHistory?.flatMap((m) => m.entries) ?? [];
      const found = entries.find((e) => e.id === id) ?? null;
      setEditEntry(found);
    },
    [summary?.serviceHistory, setEditEntry],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-base text-nova-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-8">
      <div className="min-w-0 flex-1">
        <ServicesHistoryPanel
          months={summary?.serviceHistory ?? []}
          onViewEntry={(entry) => setSelectedDetailEntry(entry)}
          onEditEntry={handleEditEntry}
        />
      </div>
      <ServicesSidePanel
        nextServiceDate={summary?.nextAppointment?.date ?? "—"}
        nextServiceSubtitle={summary?.nextAppointment?.cancellationNote ?? "Nenhum agendamento"}
        nextAppointmentId={summary?.nextAppointment?.id ?? null}
        nextAppointmentDateTime={summary?.nextAppointment?.dateTime ?? null}
        appointmentsCount={summary?.appointmentsCount ?? 0}
        appointmentsLabel={summary?.appointmentsCountLabel ?? "Nos últimos 2 meses"}
        hasNextService={summary?.nextAppointment !== null && summary?.nextAppointment !== undefined}
        onChanged={loadSummary}
      />
      <ServiceDetailModal
        entry={selectedDetailEntry}
        onClose={() => setSelectedDetailEntry(null)}
      />
      <ServiceEditDrawer
        entry={editEntry}
        onClose={() => setEditEntry(null)}
        onSaved={loadSummary}
      />
    </div>
  );
}
