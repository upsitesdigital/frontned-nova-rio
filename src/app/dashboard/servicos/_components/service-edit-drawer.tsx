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
  DsIconButton,
  DsCancelConfirmPopup,
  DsAlert,
} from "@/design-system";
import { DsIcon } from "@/design-system/media";
import { Sheet, SheetContent } from "@/design-system/ui";
import { IconMap } from "@/lib/display/icon-map";
import { PaymentStatus } from "@/lib/display/payment-status-map";
import { useServiceEditStore, type RecurrenceType } from "@/stores/client/service-edit-store";
import { useToastStore } from "@/stores/ui/toast-store";
import type { ServiceHistoryEntry } from "@/api/client/dashboard-api";

export interface ServiceEditDrawerProps {
  entry: ServiceHistoryEntry | null;
  onClose: () => void;
  onSaved?: () => void;
}

export function ServiceEditDrawer({ entry, onClose, onSaved }: ServiceEditDrawerProps) {
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
    downloadServiceReceipt,
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

  const serviceIcon = IconMap.getServiceIcon(entry.icon);
  const paymentStatus = entry.payment
    ? PaymentStatus.resolvePaymentStatus(entry.payment.status)
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
          <DsIconButton
            icon={XIcon}
            iconSize="lg"
            ariaLabel="Fechar"
            variant="ghost"
            onClick={onClose}
            className="absolute left-16 top-10 size-11 cursor-pointer rounded-[6px] bg-nova-gray-50 text-nova-gray-700 hover:bg-nova-gray-100"
          />

          {/* Header via DsServiceDetailPopup (stripped popup styling for drawer context) */}
          <DsServiceDetailPopup
            icon={serviceIcon}
            serviceName={entry.label}
            date={entry.date}
            onReceipt={
              entry.payment?.paymentId
                ? () => {
                    downloadServiceReceipt(entry.payment!.paymentId).catch(() =>
                      showToast("Erro ao baixar recibo. Tente novamente.", "error"),
                    );
                  }
                : undefined
            }
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
          closeLabel="Fechar"
          title="Escolher data e horário"
          cancelLabel="Cancelar"
          confirmLabel="Ok"
          open={rescheduleOpen}
          date={rescheduleDate}
          time={rescheduleTime}
          onDateChange={setRescheduleDate}
          onTimeChange={setRescheduleTime}
          onCancel={closeReschedule}
          onClose={closeReschedule}
          onConfirm={closeReschedule}
          confirmDisabled={isSaving}
        />

        <DsCancelConfirmPopup
          closeLabel="Fechar"
          description="Cancelamento com 1h de antecedência"
          title="Deseja cancelar o serviço?"
          confirmLabel="Sim, cancelar"
          cancelLabel="Manter agendamento"
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
          confirmDisabled={isSaving}
        />
      </SheetContent>
    </Sheet>
  );
}
