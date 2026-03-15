import { create } from "zustand";

import { listCards, type Card } from "@/api/cards-api";
import { fetchClientPayments, type PaymentEntry } from "@/api/payments-api";
import { getAuthToken } from "@/lib/auth-helpers";

interface DashboardPaymentsState {
  cards: Card[];
  recentPayments: PaymentEntry[];
  isLoading: boolean;
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
};

const useDashboardPaymentsStore = create<DashboardPaymentsStore>()((set) => ({
  ...initialState,

  loadPaymentsData: async () => {
    const token = await getAuthToken();
    if (!token) return;

    set({ isLoading: true });

    try {
      const [cards, paymentsResult] = await Promise.all([
        listCards(token),
        fetchClientPayments(token, 1, 5),
      ]);
      set({ cards, recentPayments: paymentsResult.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  reset: () => set(initialState),
}));

export { useDashboardPaymentsStore, type DashboardPaymentsStore };
