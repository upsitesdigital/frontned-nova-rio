"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsAlert,
  DsButton,
  DsCheckbox,
  DsDeleteConfirmPopup,
  DsFormField,
  DsIcon,
  DsInput,
  DsLoadingState,
  DsPageHeader,
} from "@/design-system";
import { waitForAuthHydration } from "@/stores/auth-store";
import { useAdminHolidaysStore } from "@/stores/admin-holidays-store";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function AdminHolidaysPage() {
  const [pendingDeleteHolidayId, setPendingDeleteHolidayId] = useState<number | null>(null);

  const {
    holidays,
    yearFilter,
    isLoading,
    isSaving,
    isSyncing,
    deletingHolidayId,
    error,
    isEditorOpen,
    editingHolidayId,
    form,
    loadHolidays,
    setYearFilter,
    openCreateEditor,
    openEditEditor,
    closeEditor,
    updateFormField,
    saveHoliday,
    removeHoliday,
    syncHolidaysByYear,
    reset,
  } = useAdminHolidaysStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      void loadHolidays();
    });

    return () => {
      reset();
    };
  }, [loadHolidays, reset]);

  const pendingDeleteHoliday = useMemo(
    () => holidays.find((holiday) => holiday.id === pendingDeleteHolidayId) ?? null,
    [holidays, pendingDeleteHolidayId],
  );

  const isDeletingPendingHoliday =
    pendingDeleteHoliday !== null && deletingHolidayId === pendingDeleteHoliday.id;

  const handleSave = () => {
    if (isSaving) return;
    void saveHoliday();
  };

  const handleSync = () => {
    if (isSyncing) return;
    void syncHolidaysByYear();
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteHoliday || isDeletingPendingHoliday) return;

    void removeHoliday(pendingDeleteHoliday.id).then((removed) => {
      if (removed) setPendingDeleteHolidayId(null);
    });
  };

  if (isLoading && holidays.length === 0) {
    return <DsLoadingState className="my-20" />;
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <DsPageHeader
          title="Feriados"
          subtitle="Gerencie os feriados e bloqueios do calendário de agendamentos."
          action={
            <DsButton
              variant="default"
              className="flex h-14 items-center justify-center gap-1 rounded-xl bg-nova-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white hover:bg-nova-primary/90"
              onClick={openCreateEditor}
            >
              <DsIcon icon={PlusIcon} size="lg" className="text-white" />
              Novo feriado
            </DsButton>
          }
        />

        {error && <DsAlert variant="error" title={error} className="max-w-132" />}

        <div className="flex flex-col gap-4 rounded-[10px] border border-nova-gray-100 bg-white p-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full max-w-56">
            <DsFormField label="Ano">
              <DsInput
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                placeholder="2026"
              />
            </DsFormField>
          </div>

          <DsButton variant="outline" className="h-12 px-6" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? "Sincronizando..." : "Sincronizar feriados do ano"}
          </DsButton>
        </div>

        <div className="overflow-hidden rounded-[10px] border border-nova-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-nova-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Data</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Nome</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Tipo</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Bloqueia agenda</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {holidays.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-nova-gray-600">
                      Nenhum feriado encontrado para o ano selecionado.
                    </td>
                  </tr>
                )}

                {holidays.map((holiday) => (
                  <tr key={holiday.id} className="border-b border-nova-gray-50">
                    <td className="px-6 py-4 text-sm text-black">{formatDate(holiday.date)}</td>
                    <td className="px-6 py-4 text-sm text-nova-gray-700">{holiday.name}</td>
                    <td className="px-6 py-4 text-sm text-nova-gray-700">{holiday.type}</td>
                    <td className="px-6 py-4 text-sm text-nova-gray-700">
                      {holiday.isBlocked ? "Sim" : "Não"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DsButton
                          variant="outline"
                          className="h-9 border-nova-gray-200 px-3 text-sm"
                          onClick={() => openEditEditor(holiday.id)}
                          disabled={isSaving || deletingHolidayId === holiday.id}
                        >
                          <DsIcon icon={PencilSimpleIcon} size="sm" className="text-nova-gray-700" />
                          Editar
                        </DsButton>
                        <DsButton
                          variant="outline"
                          className="h-9 border-nova-error/40 px-3 text-sm text-nova-error hover:bg-nova-error/5"
                          onClick={() => setPendingDeleteHolidayId(holiday.id)}
                          disabled={isSaving || deletingHolidayId === holiday.id}
                        >
                          <DsIcon icon={TrashIcon} size="sm" className="text-nova-error" />
                          Excluir
                        </DsButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={closeEditor}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeEditor();
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar"
          />

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex w-full max-w-140 flex-col gap-6 rounded-2xl bg-white p-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-medium text-black">
                  {editingHolidayId ? "Editar feriado" : "Novo feriado"}
                </h2>
                <p className="text-sm text-nova-gray-700">Defina a data e o comportamento do feriado.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DsFormField label="Data">
                  <DsInput
                    type="date"
                    value={form.date}
                    onChange={(event) => updateFormField("date", event.target.value)}
                  />
                </DsFormField>

                <DsFormField label="Nome">
                  <DsInput
                    value={form.name}
                    onChange={(event) => updateFormField("name", event.target.value)}
                    placeholder="Ex.: Tiradentes"
                  />
                </DsFormField>
              </div>

              <label className="flex items-center gap-3 text-sm text-nova-gray-700">
                <DsCheckbox
                  checked={form.isBlocked}
                  onCheckedChange={(checked) => updateFormField("isBlocked", checked)}
                />
                Bloquear agendamentos nesta data
              </label>

              <div className="flex items-center justify-end gap-3">
                <DsButton variant="outline" className="h-12 px-6" onClick={closeEditor} disabled={isSaving}>
                  Cancelar
                </DsButton>
                <DsButton
                  variant="default"
                  className="h-12 bg-nova-primary px-6 text-white hover:bg-nova-primary/90"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </DsButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteHoliday && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              if (isDeletingPendingHoliday) return;
              setPendingDeleteHolidayId(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !isDeletingPendingHoliday) {
                setPendingDeleteHolidayId(null);
              }
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar confirmação de exclusão"
          />

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <DsDeleteConfirmPopup
              className="max-w-lg"
              title="Tem certeza que deseja excluir o feriado"
              description="Ao excluir, essa data deixará de aparecer no calendário de feriados."
              confirmLabel={isDeletingPendingHoliday ? "Excluindo..." : "Sim, quero excluir"}
              cancelLabel="Manter feriado"
              onConfirm={handleConfirmDelete}
              onCancel={() => {
                if (isDeletingPendingHoliday) return;
                setPendingDeleteHolidayId(null);
              }}
              onClose={() => {
                if (isDeletingPendingHoliday) return;
                setPendingDeleteHolidayId(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
