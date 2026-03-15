type PaymentStatusInfo = {
  status: "approved" | "pending" | "cancelled";
  label: string;
};

const PAYMENT_STATUS_MAP: Record<string, PaymentStatusInfo> = {
  APPROVED: { status: "approved", label: "Aprovado" },
  PENDING: { status: "pending", label: "Pendente" },
  CANCELLED: { status: "cancelled", label: "Cancelado" },
};

function resolvePaymentStatus(status: string): PaymentStatusInfo {
  return PAYMENT_STATUS_MAP[status] ?? { status: "pending", label: status };
}

export { PAYMENT_STATUS_MAP, resolvePaymentStatus, type PaymentStatusInfo };
