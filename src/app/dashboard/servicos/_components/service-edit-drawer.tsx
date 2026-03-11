"use client";

import { useState } from "react";
import {
  CreditCardIcon,
  FloppyDiskIcon,
  MapPinIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  DsRadioOptionCard,
  DsCollapsibleSection,
  DsPaymentInfoCard,
  DsServiceDetailPopup,
  DsInput,
  DsFormField,
  DsButton,
} from "@/design-system";
import { DsIcon } from "@/design-system/media";
import {
  Sheet,
  SheetContent,
} from "@/design-system/ui/sheet";
import { getServiceIcon } from "@/lib/icon-map";
import type { ServiceHistoryEntry } from "./services-history-panel";

interface ServiceEditDrawerProps {
  entry: ServiceHistoryEntry | null;
  onClose: () => void;
}

const PAYMENT_STATUS_MAP: Record<string, { label: string; status: "approved" | "pending" }> = {
  APPROVED: { label: "Aprovado", status: "approved" },
  PENDING: { label: "Pendente", status: "pending" },
  CANCELLED: { label: "Cancelado", status: "pending" },
};

function ServiceEditDrawer({ entry, onClose }: ServiceEditDrawerProps) {
  const [recurrence, setRecurrence] = useState(entry?.recurrenceType ?? "SINGLE");

  if (!entry) return null;

  const serviceIcon = getServiceIcon(entry.icon);
  const paymentStatus = entry.payment
    ? PAYMENT_STATUS_MAP[entry.payment.status] ?? { label: entry.payment.status, status: "pending" as const }
    : null;

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full overflow-y-auto border-none sm:max-w-[540px]"
      >
        <div className="flex flex-col gap-8 px-15 py-30">
          {/* Close button — drawer-specific position (left side) */}
          <button
            type="button"
            onClick={onClose}
            className="absolute left-16 top-10 flex size-11 cursor-pointer items-center justify-center rounded-[6px] bg-nova-gray-50 transition-colors hover:bg-nova-gray-100"
          >
            <DsIcon icon={XIcon} size="lg" className="text-nova-gray-700" />
          </button>

          {/* Header + content via DsServiceDetailPopup (stripped of popup wrapper styling) */}
          <DsServiceDetailPopup
            icon={serviceIcon}
            serviceName={entry.label}
            date={entry.date}
            onReceipt={() => {}}
            className="rounded-none border-none p-0 shadow-none"
          >
            <div className="flex flex-col gap-8 pt-4">
              {/* Recurrence */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-xl font-medium leading-[1.3] text-black">
                    Configurar Recorrência
                  </p>
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
                    selected={recurrence === "WEEKLY" || recurrence === "BIWEEKLY" || recurrence === "MONTHLY"}
                    onClick={() => setRecurrence("MONTHLY")}
                  />
                </div>
              </div>

              {/* Payment info */}
              {entry.payment && paymentStatus && (
                <DsPaymentInfoCard
                  icon={CreditCardIcon}
                  description={
                    entry.payment.cardLastFour
                      ? `Terminado em ${entry.payment.cardLastFour}`
                      : "Pagamento"
                  }
                  amount={entry.payment.amount}
                  status={paymentStatus.status}
                  statusLabel={paymentStatus.label}
                />
              )}

              {/* Location */}
              {entry.locationName && (
                <DsCollapsibleSection icon={MapPinIcon} title={entry.locationName}>
                  <DsFormField label="CEP" htmlFor="edit-cep">
                    <DsInput id="edit-cep" placeholder="00000-000" defaultValue="22640-102" />
                  </DsFormField>
                  <DsFormField label="Endereço" htmlFor="edit-address">
                    <DsInput id="edit-address" placeholder="Endereço" defaultValue="Av. das Américas, 3500" />
                  </DsFormField>
                  <DsFormField label="Complemento" htmlFor="edit-complement">
                    <DsInput id="edit-complement" placeholder="Complemento" defaultValue="" />
                  </DsFormField>
                </DsCollapsibleSection>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-6">
                  <DsButton
                    variant="secondary"
                    size="flow-sm"
                    className="bg-nova-gray-100 text-nova-gray-700 hover:bg-nova-gray-200"
                  >
                    Reagendar
                  </DsButton>
                  <DsButton
                    variant="outline"
                    size="flow-sm"
                    className="border-nova-gray-300 text-nova-gray-700 shadow-none hover:bg-nova-gray-50"
                  >
                    Cancelar
                  </DsButton>
                </div>
                <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-400">
                  Cancelamento com 1h de antecedência
                </p>
              </div>

              {/* Save */}
              <DsButton size="flow" className="self-start">
                <DsIcon icon={FloppyDiskIcon} size="lg" className="text-white" />
                Salvar alterações
              </DsButton>
            </div>
          </DsServiceDetailPopup>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { ServiceEditDrawer, type ServiceEditDrawerProps };
