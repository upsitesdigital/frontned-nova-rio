import type { Card } from "@/api/client/cards-api";
import type { PaymentEntry } from "@/api/client/payments-api";
import { PaymentFormat } from "@/lib/formatting/payment-format";
import { PaymentStatus } from "@/lib/display/payment-status-map";
import type { RegisteredCard, RecentPayment } from "@/types/payment";

class DashboardPaymentsMapper {
  private static readonly brandIconMap: Record<string, string> = {
    VISA: "/icons/Visa.svg",
    MASTERCARD: "/icons/master-card-icon.svg",
    AMEX: "/icons/Amex.svg",
    ELO: "/icons/Elo.svg",
    HIPERCARD: "/icons/Hipercard.svg",
  };

  private static mapDashboardPaymentMethodLabel(payment: PaymentEntry): string {
    if (payment.method === "PIX") return "PIX";
    if (payment.card?.lastFourDigits) {
      return `Terminado em ${payment.card.lastFourDigits}`;
    }
    return "Cartão";
  }

  static mapCardsToPanel(cards: Card[]): RegisteredCard[] {
    return cards.map((card) => ({
      id: card.id,
      brandSrc: DashboardPaymentsMapper.brandIconMap[card.brand] ?? "/icons/master-card-icon.svg",
      lastDigits: card.lastFourDigits,
      expiry: `${String(card.expiryMonth).padStart(2, "0")}/${card.expiryYear}`,
    }));
  }

  static mapPaymentsToPanel(payments: PaymentEntry[]): RecentPayment[] {
    return payments.map((p) => {
      const mapped = PaymentStatus.resolvePaymentStatus(p.status);
      return {
        id: p.id,
        method: p.method === "PIX" ? "pix" : "card",
        methodLabel: DashboardPaymentsMapper.mapDashboardPaymentMethodLabel(p),
        service: p.appointment.service.name,
        amount: PaymentFormat.formatPaymentAmount(p.amount),
        status: mapped.status,
        statusLabel: mapped.label,
      };
    });
  }
}

export { DashboardPaymentsMapper };
