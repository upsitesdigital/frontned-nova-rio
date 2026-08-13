import { create } from "zustand";

import type { Card } from "@/api/client/cards-api";
import type { PaymentEntry } from "@/api/client/payments-api";
import { LoadDashboardPayments } from "@/use-cases/client-dashboard/load-dashboard-payments";

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

    const result = await LoadDashboardPayments.loadDashboardPayments();
    set({
      cards: result.cards,
      recentPayments: result.payments,
      isLoading: false,
      error: result.error,
    });
  },

  reset: () => set(initialState),
}));

export { useDashboardPaymentsStore, type DashboardPaymentsStore };
