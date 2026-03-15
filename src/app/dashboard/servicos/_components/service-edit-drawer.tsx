"use client";

import { useEffect } from "react";
import { parse } from "date-fns";
import { CreditCardIcon, FloppyDiskIcon, MapPinIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsRadioOptionCard,
  DsCollapsibleSection,
  DsPaymentInfoCard,
  DsServiceDetailPopup,
  DsSchedulePopup,
  DsSelect,
  DsInput,
  DsFormField,
  DsButton,
  DsCancelConfirmPopup,
  DsAlert,
} from "@/design-system";
import { DsIcon } from "@/design-system/media";
import { Sheet, SheetContent } from "@/design-system/ui";
import { getServiceIcon } from "@/lib/icon-map";
import { useServiceEditStore, type RecurrenceType } from "@/stores/service-edit-store";
import { useToastStore } from "@/stores/toast-store";
import type { ServiceHistoryEntry } from "./services-history-panel";

interface ServiceEditDrawerProps {
  entry: ServiceHistoryEntry | null;
  onClose: () => void;
  onSaved?: () => void;
}

const PAYMENT_STATUS_MAP: Record<string, { label: string; status: "approved" | "pending" }> = {
  APPROVED: { label: "Aprovado", status: "approved" },
  PENDING: { label: "Pendente", status: "pending" },
  CANCELLED: { label: "Cancelado", status: "pending" },
};

function ServiceEditDrawer({ entry, onClose, onSaved }: ServiceEditDrawerProps) {
  const {
    recurrence,
    setRecurrence,
    initRecurrence,
    rescheduleOpen,
    rescheduleDate,
    rescheduleTime,
    cancelOpen,
    isSaving,
    saveError,
    openReschedule,
    closeReschedule,
    setRescheduleDate,
    setRescheduleTime,
    confirmReschedule,
    openCancel,
    closeCancel,
    confirmCancel,
    addressSectionOpen,
    setAddressSectionOpen,
    reset,
  } = useServiceEditStore();
  const showToast = useToastStore((s) => s.showToast);

  useEffect(() => {
    if (entry) {
      initRecurrence((entry.recurrenceType as RecurrenceType) ?? "SINGLE");
    }
    return () => {
      reset();
    };
  }, [entry, initRecurrence, reset]);

  if (!entry) return null;

  const serviceIcon = getServiceIcon(entry.icon);
  const paymentStatus = entry.payment
    ? (PAYMENT_STATUS_MAP[entry.payment.status] ?? {
        label: entry.payment.status,
        status: "pending" as const,
      })
    : null;

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full overflow-y-auto border-none sm:max-w-136"
      >
        <div className="flex flex-col gap-8 px-15 py-30">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute left-16 top-10 flex size-11 cursor-pointer items-center justify-center rounded-[6px] bg-nova-gray-50 transition-colors hover:bg-nova-gray-100"
          >
            <DsIcon icon={XIcon} size="lg" className="text-nova-gray-700" />
          </button>

          {/* Header via DsServiceDetailPopup (stripped popup styling for drawer context) */}
          <DsServiceDetailPopup
            icon={serviceIcon}
            serviceName={entry.label}
            date={entry.date}
            onReceipt={() => {}}
            className="rounded-none border-none p-0 shadow-none"
          >
            <></>
          </DsServiceDetailPopup>

          {/* Recurrence */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-medium leading-[1.3] text-black">Configurar Recorrência</p>
              <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                Escolha como deseja agendar seus serviços de limpeza
              </p>
            </div>
            <div className="flex gap-3">
              <DsRadioOptionCard
                label="Avulso"
                selected={recurrence === "SINGLE"}
                onClick={() => setRecurrence("SINGLE")}
              />
              <DsRadioOptionCard
                label="Pacote"
                selected={recurrence === "PACKAGE"}
                onClick={() => setRecurrence("PACKAGE")}
              />
              <DsRadioOptionCard
                label="Recorrência"
                badge="5% OFF"
                selected={
                  recurrence === "WEEKLY" || recurrence === "BIWEEKLY" || recurrence === "MONTHLY"
                }
                onClick={() => setRecurrence("MONTHLY")}
              />
            </div>
            {(recurrence === "WEEKLY" || recurrence === "BIWEEKLY" || recurrence === "MONTHLY") && (
              <div className="flex flex-col gap-1.5">
                <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                  Selecione o tipo de recorrência
                </p>
                <DsSelect
                  options={[
                    { value: "MONTHLY", label: "Mensal" },
                    { value: "BIWEEKLY", label: "Quinzenal" },
                    { value: "WEEKLY", label: "Semanal" },
                  ]}
                  value={recurrence}
                  onValueChange={(v) => setRecurrence(v as RecurrenceType)}
                  className="w-full gap-1 rounded-md border-nova-gray-100 bg-white px-4 py-3 text-base leading-normal tracking-[-0.64px] text-nova-gray-600 shadow-none data-[size=default]:h-auto"
                />
              </div>
            )}
          </div>

          {/* Payment + Location */}
          <div className="flex flex-col gap-4">
            <DsPaymentInfoCard
              icon={CreditCardIcon}
              description={
                entry.payment?.cardLastFour
                  ? `Terminado em ${entry.payment.cardLastFour}`
                  : "Pagamento"
              }
              amount={entry.payment?.amount ?? "—"}
              status={paymentStatus?.status ?? "pending"}
              statusLabel={paymentStatus?.label ?? "Pendente"}
            />
            <DsCollapsibleSection
              icon={MapPinIcon}
              title={entry.locationName ?? "Endereço"}
              open={addressSectionOpen}
              onOpenChange={setAddressSectionOpen}
            >
              <DsFormField label="CEP" htmlFor="edit-cep">
                <DsInput
                  id="edit-cep"
                  placeholder="00000-000"
                  defaultValue={entry.locationZip ?? ""}
                />
              </DsFormField>
              <DsFormField label="Endereço" htmlFor="edit-address">
                <DsInput
                  id="edit-address"
                  placeholder="Endereço"
                  defaultValue={entry.locationAddress ?? ""}
                />
              </DsFormField>
              <DsFormField label="Complemento" htmlFor="edit-complement">
                <DsInput id="edit-complement" placeholder="Complemento" defaultValue="" />
              </DsFormField>
            </DsCollapsibleSection>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <DsButton
                variant="secondary"
                size="flow-sm"
                className="bg-nova-gray-100 text-nova-gray-700 hover:bg-nova-gray-200"
                disabled={!entry.canEdit || isSaving}
                onClick={() =>
                  openReschedule(parse(entry.date, "dd/MM", new Date()), entry.startTime)
                }
              >
                Reagendar
              </DsButton>
              <DsButton
                variant="outline"
                size="flow-sm"
                className="border-nova-gray-300 text-nova-gray-700 shadow-none hover:bg-nova-gray-50"
                disabled={!entry.canEdit || isSaving}
                onClick={openCancel}
              >
                Cancelar
              </DsButton>
            </div>
            <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-400">
              Cancelamento com 1h de antecedência
            </p>
          </div>

          {/* Feedback */}
          {saveError && <DsAlert variant="error" title={saveError} />}

          {/* Save */}
          <DsButton
            size="flow"
            className="self-start"
            disabled={!entry.canEdit || isSaving || (!rescheduleDate && !rescheduleTime)}
            onClick={async () => {
              const success = await confirmReschedule(entry.id);
              if (success) {
                onClose();
                showToast("Agendamento atualizado com sucesso!");
                onSaved?.();
              }
            }}
          >
            <DsIcon icon={FloppyDiskIcon} size="lg" className="text-white" />
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </DsButton>
        </div>

        <DsSchedulePopup
          open={rescheduleOpen}
          date={rescheduleDate}
          time={rescheduleTime}
          onDateChange={setRescheduleDate}
          onTimeChange={setRescheduleTime}
          onCancel={closeReschedule}
          onClose={closeReschedule}
          onConfirm={closeReschedule}
        />

        <DsCancelConfirmPopup
          open={cancelOpen}
          onCancel={closeCancel}
          onClose={closeCancel}
          onConfirm={async () => {
            const success = await confirmCancel(entry.id);
            if (success) {
              onClose();
              showToast("Agendamento cancelado com sucesso!");
              onSaved?.();
            }
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

export { ServiceEditDrawer, type ServiceEditDrawerProps };
