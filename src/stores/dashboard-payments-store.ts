import { create } from "zustand";

import { listCards, type Card } from "@/api/cards-api";
import { fetchClientPayments, type PaymentEntry } from "@/api/payments-api";

interface DashboardPaymentsState {
  cards: Card[];
  recentPayments: PaymentEntry[];
  isLoading: boolean;
  error: string | null;
}

interface DashboardPaymentsActions {
  loadPaymentsData: () => Promise<void>;
  reset: () => void;
}

type DashboardPaymentsStore = DashboardPaymentsState & DashboardPaymentsActions;

const initialState: DashboardPaymentsState = {
  cards: [],
  recentPayments: [],
  isLoading: false,
  error: null,
};

const useDashboardPaymentsStore = create<DashboardPaymentsStore>()((set) => ({
  ...initialState,

  loadPaymentsData: async () => {
    set({ isLoading: true, error: null });

    try {
      const [cards, paymentsResult] = await Promise.all([listCards(), fetchClientPayments(1, 5)]);
      set({ cards, recentPayments: paymentsResult.data, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Erro ao carregar dados de pagamento." });
    }
  },

  reset: () => set(initialState),
}));

export { useDashboardPaymentsStore, type DashboardPaymentsStore };
