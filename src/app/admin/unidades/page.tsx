"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsAlert,
  DsButton,
  DsDeleteConfirmPopup,
  DsFormField,
  DsIcon,
  DsInput,
  DsLoadingState,
  DsPageHeader,
  DsPagination,
} from "@/design-system";
import { waitForAuthHydration } from "@/stores/auth-store";
import { useAdminUnitsStore } from "@/stores/admin-units-store";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function AdminUnitsPage() {
  const [pendingDeleteUnitId, setPendingDeleteUnitId] = useState<number | null>(null);

  const {
    units,
    totalUnits,
    currentPage,
    pageSize,
    isLoading,
    isSaving,
    deletingUnitId,
    error,
    isEditorOpen,
    form,
    loadUnits,
    setCurrentPage,
    openCreateEditor,
    openEditEditor,
    closeEditor,
    updateFormField,
    saveUnit,
    removeUnit,
    reset,
  } = useAdminUnitsStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      void loadUnits(1);
    });

    return () => {
      reset();
    };
  }, [loadUnits, reset]);

  const totalPages = Math.max(1, Math.ceil(totalUnits / pageSize));

  const pendingDeleteUnit = useMemo(
    () => units.find((unit) => unit.id === pendingDeleteUnitId) ?? null,
    [units, pendingDeleteUnitId],
  );

  const isDeletingPendingUnit =
    pendingDeleteUnit !== null && deletingUnitId === pendingDeleteUnit.id;

  const handleSave = () => {
    if (isSaving) return;
    void saveUnit();
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteUnit || isDeletingPendingUnit) return;

    void removeUnit(pendingDeleteUnit.id).then((removed) => {
      if (removed) setPendingDeleteUnitId(null);
    });
  };

  if (isLoading && units.length === 0) {
    return <DsLoadingState className="my-20" />;
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <DsPageHeader
          title="Unidades"
          subtitle="Gerencie as unidades e as áreas de cobertura de atendimento."
          action={
            <DsButton
              variant="default"
              className="flex h-14 items-center justify-center gap-1 rounded-xl bg-nova-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white hover:bg-nova-primary/90"
              onClick={openCreateEditor}
            >
              <DsIcon icon={PlusIcon} size="lg" className="text-white" />
              Criar unidade
            </DsButton>
          }
        />

        {error && <DsAlert variant="error" title={error} className="max-w-132" />}

        <div className="overflow-hidden rounded-[10px] border border-nova-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-nova-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Nome</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Endereço</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Raio</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Coordenadas</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Atualizado</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {units.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-nova-gray-600">
                      Nenhuma unidade cadastrada.
                    </td>
                  </tr>
                )}

                {units.map((unit) => (
                  <tr key={unit.id} className="border-b border-nova-gray-50">
                    <td className="px-6 py-4 text-sm text-black">{unit.name}</td>
                    <td className="px-6 py-4 text-sm text-nova-gray-700">
                      {unit.address ?? "Não informado"}
                    </td>
                    <td className="px-6 py-4 text-sm text-nova-gray-700">
                      {unit.serviceRadiusKm.toFixed(1).replace(".", ",")} km
                    </td>
                    <td className="px-6 py-4 text-sm text-nova-gray-700">
                      {unit.latitude !== null && unit.longitude !== null
                        ? `${unit.latitude.toFixed(4)}, ${unit.longitude.toFixed(4)}`
                        : "Não informado"}
                    </td>
                    <td className="px-6 py-4 text-sm text-nova-gray-700">{formatDate(unit.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DsButton
                          variant="outline"
                          className="h-9 border-nova-gray-200 px-3 text-sm"
                          onClick={() => openEditEditor(unit.id)}
                          disabled={isSaving || deletingUnitId === unit.id}
                        >
                          <DsIcon icon={PencilSimpleIcon} size="sm" className="text-nova-gray-700" />
                          Editar
                        </DsButton>
                        <DsButton
                          variant="outline"
                          className="h-9 border-nova-error/40 px-3 text-sm text-nova-error hover:bg-nova-error/5"
                          onClick={() => setPendingDeleteUnitId(unit.id)}
                          disabled={isSaving || deletingUnitId === unit.id}
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

          {units.length > 0 && (
            <div className="border-t border-nova-gray-100 px-6">
              <DsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalUnits}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
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
            <div className="flex w-full max-w-170 flex-col gap-6 rounded-2xl bg-white p-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-medium text-black">
                  {form.name ? "Editar unidade" : "Nova unidade"}
                </h2>
                <p className="text-sm text-nova-gray-700">Configure os dados da unidade de atendimento.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DsFormField label="Nome">
                  <DsInput
                    value={form.name}
                    onChange={(event) => updateFormField("name", event.target.value)}
                    placeholder="Ex.: Unidade Centro"
                  />
                </DsFormField>

                <DsFormField label="Raio de cobertura (km)">
                  <DsInput
                    value={form.serviceRadiusKmInput}
                    onChange={(event) => updateFormField("serviceRadiusKmInput", event.target.value)}
                    placeholder="5"
                  />
                </DsFormField>

                <DsFormField label="Latitude">
                  <DsInput
                    value={form.latitudeInput}
                    onChange={(event) => updateFormField("latitudeInput", event.target.value)}
                    placeholder="-22.9068"
                  />
                </DsFormField>

                <DsFormField label="Longitude">
                  <DsInput
                    value={form.longitudeInput}
                    onChange={(event) => updateFormField("longitudeInput", event.target.value)}
                    placeholder="-43.1729"
                  />
                </DsFormField>
              </div>

              <DsFormField label="Endereço">
                <DsInput
                  value={form.address}
                  onChange={(event) => updateFormField("address", event.target.value)}
                  placeholder="Ex.: Rua das Flores, 123 - Centro"
                />
              </DsFormField>

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

      {pendingDeleteUnit && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              if (isDeletingPendingUnit) return;
              setPendingDeleteUnitId(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !isDeletingPendingUnit) {
                setPendingDeleteUnitId(null);
              }
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar confirmação de exclusão"
          />

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <DsDeleteConfirmPopup
              className="max-w-lg"
              title="Tem certeza que deseja excluir a unidade"
              description="Ao excluir a unidade, ela deixará de estar disponível para seleção em novos agendamentos."
              confirmLabel={isDeletingPendingUnit ? "Excluindo..." : "Sim, quero excluir"}
              cancelLabel="Manter unidade"
              onConfirm={handleConfirmDelete}
              onCancel={() => {
                if (isDeletingPendingUnit) return;
                setPendingDeleteUnitId(null);
              }}
              onClose={() => {
                if (isDeletingPendingUnit) return;
                setPendingDeleteUnitId(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
