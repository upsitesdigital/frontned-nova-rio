"use client";

import {
  CreditCardIcon,
  MapPinIcon,
} from "@phosphor-icons/react/dist/ssr";
import { DsIcon } from "@/design-system/media";
import { DsPopup, DsServiceDetailPopup, DsServiceDetailRow } from "@/design-system";
import { getServiceIcon } from "@/lib/icon-map";

interface ServiceDetailModalEntry {
  label: string;
  icon: string | null;
  date: string;
  recurrenceType: string;
  locationName: string | null;
  payment: {
    cardLastFour: string | null;
    amount: string;
    status: string;
  } | null;
}

interface ServiceDetailModalProps {
  entry: ServiceDetailModalEntry | null;
  onClose: () => void;
}

const RECURRENCE_LABELS: Record<string, string> = {
  SINGLE: "Avulso",
  PACKAGE: "Pacote",
  WEEKLY: "Semanal",
  BIWEEKLY: "Quinzenal",
  MONTHLY: "Mensal",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  APPROVED: "Aprovado",
  PENDING: "Pendente",
  CANCELLED: "Cancelado",
};

function ServiceDetailModal({ entry, onClose }: ServiceDetailModalProps) {
  if (!entry) return null;

  const serviceIcon = getServiceIcon(entry.icon);
  const recurrenceLabel = RECURRENCE_LABELS[entry.recurrenceType] ?? entry.recurrenceType;

  return (
    <DsPopup open>
      <DsServiceDetailPopup
        icon={serviceIcon}
        serviceName={entry.label}
        date={entry.date}
        onClose={onClose}
        className="w-full max-w-135"
      >
        {entry.payment && (
          <DsServiceDetailRow>
            <div className="flex items-center gap-2">
              <DsIcon icon={CreditCardIcon} size="lg" className="text-nova-gray-400" />
              <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                {entry.payment.cardLastFour
                  ? `Terminado em ${entry.payment.cardLastFour}`
                  : "Pagamento"}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-base font-medium leading-[1.3] text-nova-gray-700">
                {entry.payment.amount}
              </span>
              <span className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-primary">
                {PAYMENT_STATUS_LABELS[entry.payment.status] ?? entry.payment.status}
              </span>
            </div>
          </DsServiceDetailRow>
        )}

        {entry.locationName && (
          <DsServiceDetailRow>
            <div className="flex items-center gap-2">
              <DsIcon icon={MapPinIcon} size="lg" className="text-nova-gray-400" />
              <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                {entry.locationName}
              </span>
            </div>
          </DsServiceDetailRow>
        )}

        <DsServiceDetailRow>
          <div className="flex items-center gap-4">
            <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
              Recorrência
            </span>
            <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-primary">
              {recurrenceLabel}
            </span>
          </div>
        </DsServiceDetailRow>
      </DsServiceDetailPopup>
    </DsPopup>
  );
}

export { ServiceDetailModal, type ServiceDetailModalProps, type ServiceDetailModalEntry };
