type PaymentStatusInfo = {
  status: "approved" | "pending" | "cancelled";
  label: string;
};

class PaymentStatus {
  static readonly paymentStatusMap: Record<string, PaymentStatusInfo> = {
    APPROVED: { status: "approved", label: "Aprovado" },
    PENDING: { status: "pending", label: "Pendente" },
    CANCELLED: { status: "cancelled", label: "Cancelado" },
  };

  static resolvePaymentStatus(status: string): PaymentStatusInfo {
    return PaymentStatus.paymentStatusMap[status] ?? { status: "pending", label: status };
  }
}

export { PaymentStatus, type PaymentStatusInfo };
