import type { PaymentEntry } from "@/api/client/payments-api";

class PaymentFormat {
  private static readonly statusOrder: Record<PaymentEntry["status"], number> = {
    APPROVED: 0,
    PENDING: 1,
    CANCELLED: 2,
  };

  static sortPaymentsByStatus(payments: PaymentEntry[]): PaymentEntry[] {
    return [...payments].sort(
      (a, b) => PaymentFormat.statusOrder[a.status] - PaymentFormat.statusOrder[b.status],
    );
  }

  static formatPaymentMethod(entry: PaymentEntry): string {
    if (entry.method === "PIX") return "PIX";
    return "Cartão";
  }

  static formatPaymentAmount(amount: string): string {
    const value = Number(amount);
    if (isNaN(value)) return "R$ 0,00";
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  }
}

export { PaymentFormat };
