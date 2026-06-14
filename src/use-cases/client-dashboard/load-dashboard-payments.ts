import { CardsApi, type Card } from "@/api/client/cards-api";
import { PaymentsApi, type PaymentEntry } from "@/api/client/payments-api";
import { Messages } from "@/lib/core/messages";

interface DashboardPaymentsResult {
  cards: Card[];
  payments: PaymentEntry[];
  error: string | null;
}

class LoadDashboardPayments {
  static async loadDashboardPayments(): Promise<DashboardPaymentsResult> {
    try {
      const [cards, paymentsResult] = await Promise.all([CardsApi.listCards(), PaymentsApi.fetchClientPayments(1, 5)]);
      return { cards, payments: paymentsResult.data, error: null };
    } catch {
      return {
        cards: [],
        payments: [],
        error: Messages.dashboard.paymentsLoadError,
      };
    }
  }
}

export { LoadDashboardPayments, type DashboardPaymentsResult };
