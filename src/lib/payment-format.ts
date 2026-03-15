import type { PaymentEntry } from "@/api/payments-api";

const statusOrder: Record<PaymentEntry["status"], number> = {
  APPROVED: 0,
  PENDING: 1,
  CANCELLED: 2,
};

function sortPaymentsByStatus(payments: PaymentEntry[]): PaymentEntry[] {
  return [...payments].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
}

function formatPaymentMethod(entry: PaymentEntry): string {
  if (entry.method === "PIX") return "PIX";
  if (entry.card) return `Cartão •••• ${entry.card.lastFourDigits}`;
  return "Cartão";
}

function formatPaymentAmount(amount: string): string {
  const value = Number(amount);
  if (isNaN(value)) return "R$ 0,00";
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export { sortPaymentsByStatus, formatPaymentMethod, formatPaymentAmount };
