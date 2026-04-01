"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsAlert,
  DsButton,
  DsDeleteConfirmPopup,
  DsIcon,
  DsLoadingState,
  DsServiceEditPopup,
  DsServiceManageCard,
} from "@/design-system";
import { getServiceIcon } from "@/lib/icon-map";
import { formatPrice } from "@/lib/formatters";
import { waitForAuthHydration } from "@/stores/auth-store";
import {
  useAdminServicesStore,
  type PaymentOption,
  type ServiceFrequency,
} from "@/stores/admin-services-store";

const CREATED_ALERT_DURATION = 4000;

export default function AdminServicesPage() {
  const [showCreatedAlert, setShowCreatedAlert] = useState(false);
  const [pendingDeleteServiceId, setPendingDeleteServiceId] = useState<number | null>(null);

  const {
    services,
    isLoading,
    isSaving,
    deletingServiceId,
    error,
    isEditorOpen,
    form,
    loadServices,
    openCreateEditor,
    openEditEditor,
    closeEditor,
    updateFormField,
    cycleFormIcon,
    togglePaymentOption,
    toggleRecurrenceFrequency,
    saveService,
    removeService,
  } = useAdminServicesStore();

  useEffect(() => {
    waitForAuthHydration().then(() => {
      void loadServices();
    });
  }, [loadServices]);

  useEffect(() => {
    if (!showCreatedAlert) return;

    const timer = setTimeout(() => {
      setShowCreatedAlert(false);
    }, CREATED_ALERT_DURATION);

    return () => clearTimeout(timer);
  }, [showCreatedAlert]);

  const handleSave = async () => {
    if (isSaving) return;

    const result = await saveService();

    if (result === "created") {
      setShowCreatedAlert(true);
    }
  };

  const paymentOptions = [
    {
      id: "single",
      label: "Avulso",
      enabled: form.allowSingle,
    },
    {
      id: "package",
      label: "Pacote",
      enabled: form.allowPackage,
    },
    {
      id: "recurrence",
      label: "Recorrência",
      enabled: form.allowRecurrence,
      frequencies: [
        {
          label: "Semanal",
          value: "WEEKLY",
          selected: form.recurrenceFrequencies.includes("WEEKLY"),
        },
        {
          label: "Quinzenal",
          value: "BIWEEKLY",
          selected: form.recurrenceFrequencies.includes("BIWEEKLY"),
        },
        {
          label: "Mensal",
          value: "MONTHLY",
          selected: form.recurrenceFrequencies.includes("MONTHLY"),
        },
      ],
    },
  ];

  if (isLoading && services.length === 0) {
    return <DsLoadingState className="my-20" />;
  }

  const pendingDeleteService =
    pendingDeleteServiceId === null
      ? null
      : services.find((service) => service.id === pendingDeleteServiceId) ?? null;

  const isDeletingPendingService = deletingServiceId === pendingDeleteServiceId;

  const handleConfirmDelete = async () => {
    if (!pendingDeleteServiceId || isDeletingPendingService) return;

    const removed = await removeService(pendingDeleteServiceId);
    if (removed) {
      setPendingDeleteServiceId(null);
    }
  };

  return (
    <>
      {showCreatedAlert && (
        <div className="fixed top-4 left-1/2 z-60 w-93 -translate-x-1/2">
          <DsAlert variant="success" title="Serviço criado com sucesso!" />
        </div>
      )}

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-semibold leading-[1.3] tracking-[-1.92px] text-black">
              Serviços
            </h1>
            <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
              Crie e edite os serviços que serão agendados pelo cliente.
            </p>
          </div>

          <DsButton
            variant="default"
            className="flex h-14 items-center justify-center gap-1 rounded-xl bg-nova-primary px-8 py-4 text-lg font-medium leading-normal tracking-[-0.72px] text-white hover:bg-nova-primary/90"
            onClick={openCreateEditor}
          >
            <DsIcon icon={PlusIcon} size="lg" className="text-white" />
            Criar serviço
          </DsButton>
        </div>

        {error && <DsAlert variant="error" title={error} className="max-w-130" />}

        {services.length > 0 && (
          <div className="flex flex-wrap items-center gap-4">
            {services.map((service) => (
              <DsServiceManageCard
                key={service.id}
                icon={getServiceIcon(service.icon)}
                title={service.name}
                description={service.description ?? ""}
                price={formatPrice(service.basePrice)}
                className="w-125.25"
                onEdit={() => {
                  if (isSaving) return;
                  openEditEditor(service.id);
                }}
                onDelete={() => {
                  if (isSaving || deletingServiceId === service.id) return;
                  setPendingDeleteServiceId(service.id);
                }}
                deleteLabel={deletingServiceId === service.id ? "Excluindo..." : "Excluir"}
              />
            ))}
          </div>
        )}

        {services.length === 0 && !isLoading && (
          <div className="rounded-[10px] border border-nova-gray-100 bg-white p-10">
            <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
              Nenhum serviço cadastrado.
            </p>
          </div>
        )}
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={closeEditor}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                closeEditor();
              }
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar"
          />

          <div className="absolute inset-y-0 right-0 w-full max-w-166 overflow-y-auto bg-white">
            <DsServiceEditPopup
              className="min-h-full"
              onClose={closeEditor}
              icon={getServiceIcon(form.icon)}
              onChangeIcon={cycleFormIcon}
              name={form.name}
              onNameChange={(value) => updateFormField("name", value)}
              description={form.description}
              onDescriptionChange={(value) => updateFormField("description", value)}
              price={form.basePriceInput}
              onPriceChange={(value) => updateFormField("basePriceInput", value)}
              paymentOptions={paymentOptions}
              onPaymentOptionToggle={(optionId, enabled) =>
                togglePaymentOption(optionId as PaymentOption, enabled)
              }
              onFrequencyToggle={(optionId, frequencyValue, selected) => {
                if (optionId !== "recurrence") return;
                toggleRecurrenceFrequency(frequencyValue as ServiceFrequency, selected);
              }}
              onSave={() => {
                void handleSave();
              }}
              saveLabel={isSaving ? "Salvando..." : "Salvar alterações"}
            />
          </div>
        </div>
      )}

      {pendingDeleteService && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              if (isDeletingPendingService) return;
              setPendingDeleteServiceId(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !isDeletingPendingService) {
                setPendingDeleteServiceId(null);
              }
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar confirmação de exclusão"
          />

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <DsDeleteConfirmPopup
              className="max-w-lg"
              title="Tem certeza que deseja excluir o serviço"
              description="Excluindo o serviço, ele não estará mais disponível para ser agendado pelo cliente."
              confirmLabel={isDeletingPendingService ? "Excluindo..." : "Sim, quero excluir"}
              cancelLabel="Manter o serviço"
              onConfirm={() => {
                void handleConfirmDelete();
              }}
              onCancel={() => {
                if (isDeletingPendingService) return;
                setPendingDeleteServiceId(null);
              }}
              onClose={() => {
                if (isDeletingPendingService) return;
                setPendingDeleteServiceId(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
