type PaymentStatusInfo = {
  status: "approved" | "pending";
  label: string;
};

const PAYMENT_STATUS_MAP: Record<string, PaymentStatusInfo> = {
  APPROVED: { status: "approved", label: "Aprovado" },
  PENDING: { status: "pending", label: "Pendente" },
  CANCELLED: { status: "pending", label: "Cancelado" },
};

const DEFAULT_PAYMENT_STATUS: PaymentStatusInfo = { status: "pending", label: "Pendente" };

function resolvePaymentStatus(status: string): PaymentStatusInfo {
  return PAYMENT_STATUS_MAP[status] ?? { status: "pending", label: status };
}

export { PAYMENT_STATUS_MAP, DEFAULT_PAYMENT_STATUS, resolvePaymentStatus, type PaymentStatusInfo };
