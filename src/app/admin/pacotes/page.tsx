"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsAlert,
  DsButton,
  DsFormField,
  DsIcon,
  DsInput,
  DsLoadingState,
  DsPageHeader,
  DsPagination,
  DsSelect,
  DsTextarea,
} from "@/design-system";
import { waitForAuthHydration } from "@/stores/auth-store";
import { useAdminPackagesStore } from "@/stores/admin-packages-store";

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default function AdminPackagesPage() {
  const [isMounted, setIsMounted] = useState(false);

  const {
    packages,
    totalPackages,
    currentPage,
    pageSize,
    statusFilter,
    serviceFilter,
    serviceOptions,
    isLoading,
    isSaving,
    togglingPackageId,
    error,
    isEditorOpen,
    editingPackageId,
    form,
    loadPackages,
    loadServiceOptions,
    setCurrentPage,
    setStatusFilter,
    setServiceFilter,
    openCreateEditor,
    openEditEditor,
    closeEditor,
    updateFormField,
    savePackage,
    togglePackageStatus,
    reset,
  } = useAdminPackagesStore();

  useEffect(() => {
    waitForAuthHydration().then(async () => {
      await loadServiceOptions();
      await loadPackages(1);
      setIsMounted(true);
    });

    return () => {
      reset();
    };
  }, [loadPackages, loadServiceOptions, reset]);

  const serviceNameById = useMemo(() => {
    return new Map(serviceOptions.map((service) => [service.id, service.name]));
  }, [serviceOptions]);

  const totalPages = Math.max(1, Math.ceil(totalPackages / pageSize));

  const handleSave = () => {
    if (isSaving) return;
    void savePackage();
  };

  if (!isMounted && isLoading && packages.length === 0) {
    return <DsLoadingState className="my-20" />;
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <DsPageHeader
          title="Pacotes"
          subtitle="Gerencie os pacotes oferecidos para cada tipo de serviço."
          action={
            <DsButton
              variant="default"
              className="flex h-14 items-center justify-center gap-1 rounded-xl bg-nova-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white hover:bg-nova-primary/90"
              onClick={openCreateEditor}
            >
              <DsIcon icon={PlusIcon} size="lg" className="text-white" />
              Criar pacote
            </DsButton>
          }
        />

        {error && <DsAlert variant="error" title={error} className="max-w-132" />}

        <div className="grid grid-cols-1 gap-4 rounded-[10px] border border-nova-gray-100 bg-white p-4 md:grid-cols-2 lg:grid-cols-3">
          <DsFormField label="Status">
            <DsSelect
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as "all" | "active")}
              options={[
                { value: "all", label: "Todos" },
                { value: "active", label: "Somente ativos" },
              ]}
            />
          </DsFormField>

          <DsFormField label="Serviço">
            <DsSelect
              value={serviceFilter}
              onValueChange={setServiceFilter}
              options={[
                { value: "all", label: "Todos" },
                ...serviceOptions.map((service) => ({
                  value: String(service.id),
                  label: service.name,
                })),
              ]}
            />
          </DsFormField>
        </div>

        <div className="overflow-hidden rounded-[10px] border border-nova-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-nova-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Nome</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Serviço</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Horas</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Preço</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-nova-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-nova-gray-600">
                      Nenhum pacote encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}

                {packages.map((item) => {
                  const isToggling = togglingPackageId === item.id;

                  return (
                    <tr key={item.id} className="border-b border-nova-gray-50">
                      <td className="px-6 py-4 text-sm text-black">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-nova-gray-700">
                        {serviceNameById.get(item.serviceId) ?? `Serviço #${item.serviceId}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-nova-gray-700">{item.totalHours ?? "-"}</td>
                      <td className="px-6 py-4 text-sm text-nova-gray-700">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={
                            item.isActive
                              ? "rounded-full bg-green-50 px-3 py-1 text-green-700"
                              : "rounded-full bg-nova-gray-100 px-3 py-1 text-nova-gray-600"
                          }
                        >
                          {item.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DsButton
                            variant="outline"
                            className="h-9 border-nova-gray-200 px-3 text-sm"
                            onClick={() => openEditEditor(item.id)}
                            disabled={isSaving || isToggling}
                          >
                            <DsIcon icon={PencilSimpleIcon} size="sm" className="text-nova-gray-700" />
                            Editar
                          </DsButton>
                          <DsButton
                            variant="outline"
                            className="h-9 border-nova-gray-200 px-3 text-sm"
                            onClick={() => {
                              void togglePackageStatus(item.id, !item.isActive);
                            }}
                            disabled={isSaving || isToggling}
                          >
                            {isToggling
                              ? "Salvando..."
                              : item.isActive
                                ? "Inativar"
                                : "Reativar"}
                          </DsButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {packages.length > 0 && (
            <div className="border-t border-nova-gray-100 px-6">
              <DsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalPackages}
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
                  {editingPackageId ? "Editar pacote" : "Novo pacote"}
                </h2>
                <p className="text-sm text-nova-gray-700">Defina o serviço, preço e carga horária do pacote.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DsFormField label="Nome">
                  <DsInput
                    value={form.name}
                    onChange={(event) => updateFormField("name", event.target.value)}
                    placeholder="Ex.: Pacote 10 horas"
                  />
                </DsFormField>

                <DsFormField label="Serviço">
                  <DsSelect
                    value={form.serviceId}
                    onValueChange={(value) => updateFormField("serviceId", value)}
                    placeholder="Selecione o serviço"
                    options={serviceOptions.map((service) => ({
                      value: String(service.id),
                      label: service.name,
                    }))}
                  />
                </DsFormField>

                <DsFormField label="Preço (R$)">
                  <DsInput
                    value={form.priceInput}
                    onChange={(event) => updateFormField("priceInput", event.target.value)}
                    placeholder="Ex.: 1200,00"
                  />
                </DsFormField>

                <DsFormField label="Total de horas">
                  <DsInput
                    value={form.totalHoursInput}
                    onChange={(event) => updateFormField("totalHoursInput", event.target.value)}
                    placeholder="Ex.: 10"
                  />
                </DsFormField>
              </div>

              <DsFormField label="Descrição">
                <DsTextarea
                  value={form.description}
                  onChange={(event) => updateFormField("description", event.target.value)}
                  rows={4}
                  placeholder="Detalhes sobre o pacote"
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
    </>
  );
}
