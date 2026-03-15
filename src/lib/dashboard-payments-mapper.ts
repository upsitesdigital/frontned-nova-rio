import type { Card } from "@/api/cards-api";
import type { PaymentEntry } from "@/api/payments-api";
import { formatPaymentMethod, formatPaymentAmount } from "@/lib/payment-format";
import { resolvePaymentStatus } from "@/lib/payment-status-map";
import type { RegisteredCard, RecentPayment } from "@/types/payment";

const BRAND_ICON_MAP: Record<string, string> = {
  VISA: "/icons/master-card-icon.svg",
  MASTERCARD: "/icons/master-card-icon.svg",
  AMEX: "/icons/master-card-icon.svg",
  ELO: "/icons/master-card-icon.svg",
  HIPERCARD: "/icons/master-card-icon.svg",
};

function mapCardsToPanel(cards: Card[]): RegisteredCard[] {
  return cards.map((card) => ({
    id: card.id,
    brandSrc: BRAND_ICON_MAP[card.brand] ?? "/icons/master-card-icon.svg",
    lastDigits: card.lastFourDigits,
    expiry: `${String(card.expiryMonth).padStart(2, "0")}/${card.expiryYear}`,
  }));
}

function mapPaymentsToPanel(payments: PaymentEntry[]): RecentPayment[] {
  return payments.map((p) => {
    const mapped = resolvePaymentStatus(p.status);
    return {
      id: p.id,
      method: p.method === "PIX" ? "pix" : "card",
      methodLabel: formatPaymentMethod(p),
      service: p.appointment.service.name,
      amount: formatPaymentAmount(p.amount),
      status: mapped.status,
      statusLabel: mapped.label,
    };
  });
}

export { mapCardsToPanel, mapPaymentsToPanel };
