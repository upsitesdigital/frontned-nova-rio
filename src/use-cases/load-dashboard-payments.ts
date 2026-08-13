import { listCards, type Card } from "@/api/cards-api";
import { fetchClientPayments, type PaymentEntry } from "@/api/payments-api";
import { MESSAGES } from "@/lib/messages";

interface DashboardPaymentsResult {
  cards: Card[];
  payments: PaymentEntry[];
  error: string | null;
}

async function loadDashboardPayments(): Promise<DashboardPaymentsResult> {
  try {
    const [cards, paymentsResult] = await Promise.all([
      listCards(),
      fetchClientPayments(1, 5),
    ]);
    return { cards, payments: paymentsResult.data, error: null };
  } catch {
    return {
      cards: [],
      payments: [],
      error: MESSAGES.dashboard.paymentsLoadError,
    };
  }
}

export { loadDashboardPayments, type DashboardPaymentsResult };
