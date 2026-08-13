"use client";

import { useCallback } from "react";
import { useDashboardStore } from "@/stores/client/dashboard-store";
import { useToastStore } from "@/stores/ui/toast-store";
import { DownloadReceipt } from "@/use-cases/client-cards/download-receipt";
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
  const showToast = useToastStore((s) => s.showToast);

  const receiptPaymentId = summary?.nextAppointment?.receiptPaymentId ?? null;

  const handleReceipt = useCallback(() => {
    if (!receiptPaymentId) return;
    DownloadReceipt.downloadReceipt(receiptPaymentId).catch(() =>
      showToast("Erro ao baixar recibo. Tente novamente.", "error"),
    );
  }, [receiptPaymentId, showToast]);

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
    <div className="flex flex-col items-start gap-6 xl:flex-row xl:gap-8">
      <div className="w-full min-w-0 flex-1">
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
        onReceipt={receiptPaymentId ? handleReceipt : undefined}
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
