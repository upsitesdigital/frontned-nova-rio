"use client";

import { CheckIcon, HourglassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import {
  DsApprovalPopup,
  DsButton,
  type DsApprovalPopupDetail,
  type DsApprovalPopupStatus,
} from "@/design-system";
import type { AdminPayment } from "@/api/admin-payments-api";
import { useAdminPaymentsStore } from "@/stores/admin-payments-store";

const PAYMENT_STATUS_CONFIG: Record<
  AdminPayment["status"],
  DsApprovalPopupStatus
> = {
  APPROVED: {
    icon: CheckIcon,
    label: "Aprovado",
    color: "text-nova-success",
    bgColor: "bg-nova-success/10",
  },
  PENDING: {
    icon: HourglassIcon,
    label: "Pendente",
    color: "text-nova-warning",
    bgColor: "bg-nova-warning/10",
  },
  CANCELLED: {
    icon: XIcon,
    label: "Cancelado",
    color: "text-nova-error",
    bgColor: "bg-nova-error/10",
  },
};

function getPaymentMethodLabel(payment: AdminPayment): string {
  if (payment.method === "PIX") return "Pix";
  if (payment.method === "DEBIT_CARD") return "Cartão de débito";
  return "Cartão de crédito";
}

function getPaymentDescription(payment: AdminPayment): string {
  if (payment.cancellationReason) return payment.cancellationReason;
  if (payment.status === "APPROVED") return "Pagamento aprovado com sucesso.";
  if (payment.status === "PENDING") return "Pagamento aguardando confirmação.";
  return "Pagamento cancelado.";
}

function buildDetails(payment: AdminPayment): DsApprovalPopupDetail[] {
  return [
    { label: "Serviço", value: payment.appointment.service.name },
    { label: "CPF", value: payment.client.cpfCnpj ?? "Não informado" },
    { label: "Unidade", value: "Não informado" },
    { label: "E-mail", value: payment.client.email },
    { label: "Método de Pagamento", value: getPaymentMethodLabel(payment) },
  ];
}

function AdminPaymentDetailsModal() {
  const { selectedPaymentId, selectedPayment, isDetailLoading, detailError, closeDetails } =
    useAdminPaymentsStore();

  if (!selectedPaymentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-nova-gray-900/20"
        onClick={closeDetails}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeDetails();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Fechar"
      />

      <div className="relative z-10 w-full max-w-154 px-4">
        {isDetailLoading && (
          <div className="rounded-2xl bg-white p-10 text-center text-base text-nova-gray-700 shadow-lg shadow-nova-gray-300/10">
            Carregando detalhes do pagamento...
          </div>
        )}

        {!isDetailLoading && detailError && (
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-10 text-center shadow-lg shadow-nova-gray-300/10">
            <p className="text-base text-nova-error">{detailError}</p>
            <DsButton variant="soft" size="soft-md" onClick={closeDetails}>
              Fechar
            </DsButton>
          </div>
        )}

        {!isDetailLoading && !detailError && selectedPayment && (
          <DsApprovalPopup
            title="Pagamento"
            subtitle="Detalhes da cobrança"
            entityName={selectedPayment.client.name}
            description={getPaymentDescription(selectedPayment)}
            status={PAYMENT_STATUS_CONFIG[selectedPayment.status]}
            details={buildDetails(selectedPayment)}
            onClose={closeDetails}
            className="shadow-lg shadow-nova-gray-300/10"
          />
        )}
      </div>
    </div>
  );
}

export { AdminPaymentDetailsModal };
