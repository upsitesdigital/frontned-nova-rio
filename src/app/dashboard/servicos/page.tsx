"use client";

import { useState, useCallback } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import {
  ServicesHistoryPanel,
  type ServiceHistoryEntry,
} from "./_components/services-history-panel";
import { ServicesSidePanel } from "./_components/services-side-panel";
import {
  ServiceDetailModal,
  type ServiceDetailModalEntry,
} from "./_components/service-detail-modal";
import { ServiceEditDrawer } from "./_components/service-edit-drawer";

export default function ServicesPage() {
  const { summary, isLoading } = useDashboardStore();
  const [selectedEntry, setSelectedEntry] = useState<ServiceDetailModalEntry | null>(null);
  const [editEntry, setEditEntry] = useState<ServiceHistoryEntry | null>(null);

  const allEntries = summary?.serviceHistory?.flatMap((m) => m.entries) ?? [];

  const handleEditEntry = useCallback(
    (id: number) => {
      const found = allEntries.find((e) => e.id === id) ?? null;
      setEditEntry(found);
    },
    [allEntries],
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
          onViewEntry={(entry) => setSelectedEntry(entry)}
          onEditEntry={handleEditEntry}
        />
      </div>
      <ServicesSidePanel
        nextServiceDate={summary?.nextAppointment?.date ?? "—"}
        nextServiceSubtitle={summary?.nextAppointment?.cancellationNote ?? "Nenhum agendamento"}
        appointmentsCount={summary?.appointmentsCount ?? 0}
        appointmentsLabel={summary?.appointmentsCountLabel ?? "Nos últimos 2 meses"}
        hasNextService={summary?.nextAppointment !== null && summary?.nextAppointment !== undefined}
      />
      <ServiceDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      <ServiceEditDrawer entry={editEntry} onClose={() => setEditEntry(null)} />
    </div>
  );
}
